require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const notifier = require("node-notifier");

const app = express();
const TOKEN_EXPIRATION = 3600000; // Token expiration time in milliseconds (1 hour)

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    resetToken: String,
    resetTokenExpiry: Date,
});

const User = mongoose.model('User', userSchema);

// Signup route
app.post("/sign_up", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        console.log("Record Inserted Successfully");
        return res.redirect('/index.html');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error occurred while registering user");
    }
});

// Login route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            notifier.notify({
                title: 'Login Error',
                message: 'User not found',
                sound: true, // Play a notification sound
            });
            return res.redirect('/index.html');
            // return res.status(404).send("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            notifier.notify({
                title: 'Login Error',
                message: 'Incorrect password',
                sound: true, // Play a notification sound
            });

            // return res.status(401).send("Invalid password");
        } else {
            // Here you might want to implement JWT authentication
            return res.redirect('/mainpage.html');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error occurred while logging in");
    }
});

// Forget password route
// Generate a random token of 10 characters
function generateRandomToken() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        token += chars[randomIndex];
    }
    return token;
}

// Route for requesting a password reset with a 10-character token
app.post("/request_password_reset", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            notifier.notify({
                title: 'Mail Error',
                message: 'User not found',
                sound: true,
            });
            // return res.status(404).send("User not found");
        }

        const resetToken = generateRandomToken();
        const resetTokenExpiry = new Date(Date.now() + TOKEN_EXPIRATION); // Set the expiration time

        // Store the reset token and its expiry in the database
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `Use the following token to reset your password: ${resetToken}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                notifier.notify({
                    title: 'Mail Error',
                    message: 'Failed to send email',
                    sound: true,
                });
                console.error(error);
                // return res.status(500).send("Failed to send email");
            } else {
                notifier.notify({
                    title: 'Mail sent',
                    message: 'Password reset email sent successfully',
                    sound: true,
                });
            }
        });
    } catch (err) {
        console.error("Error in requesting password reset:", err);
        // return res.status(500).send("Error occurred while sending reset email");
    }
});

// Route for resetting the password with the 10-character token
app.post("/reset_password", async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() }, // Ensure the token hasn't expired
        });

        if (!user) {
            notifier.notify({
                title: 'Password reset',
                message: 'Invalid or expired token',
                sound: true,
            });
            // return res.status(404).send("Invalid or expired token");
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedNewPassword;
        user.resetToken = null; // Clear the reset token after use
        user.resetTokenExpiry = null; // Clear the expiry

        await user.save();
        notifier.notify({
            title: 'Password Reset',
            message: 'Password reset successfully',
            sound: true,
        });
        // return res.send("Password reset successfully");
    } catch (err) {
        console.error("Error in resetting password:", err);

        notifier.notify({
            title: 'Password Reset Error',
            message: 'Error occurred while resetting password',
            sound: true,
        });

        // return res.status(500).send("Error occurred while resetting password");
    }
});

app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('/mainpage.html');
}).listen(3000);

console.log("Listening on PORT 3000");


    
    

    function move() {
        // The target page for redirection
        const targetPage = 'index.html';  // Change to your desired page

        // Check the current page name
        const currentPage = window.location.pathname.split("/").pop();

        // If the current page is not 'index.html', redirect
        if (currentPage !== 'index.html') {
            window.location.href = targetPage;
        } else {
            console.log("You're already on the index page or do not want to redirect here");
        }
    }


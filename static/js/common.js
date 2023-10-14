window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // footer CLRF
    function checkWidth() {
        var p = document.getElementById('CRFL');
        if (window.innerWidth < 440) {
            p.innerHTML = p.innerHTML.replace(' and', '<br>and');
        } else {
            p.innerHTML = p.innerHTML.replace('<br>and', ' and');
        }
    }
    // event handling
    window.onload = checkWidth;
    window.onresize = checkWidth;
});

window.addEventListener('unload', function() {
    localStorage.setItem('scrollPosition', window.scrollY || window.pageYOffset);
});

window.addEventListener('load', function() {
    const savedPosition = localStorage.getItem('scrollPosition');
    if (savedPosition !== null) {
        window.scrollTo(0, savedPosition);
        localStorage.removeItem('scrollPosition');
    }
});
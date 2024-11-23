import createHeaderNav from './headernav';
import createProfileDropdown from './headerprofiledropdown';

document.addEventListener("DOMContentLoaded", function () {
    // Create header element
    const header = document.createElement("header");
    header.className = "navbar navbar-expand-lg border-bottom py-2";

    // Apply two-tone background color
    header.style.background = "linear-gradient(to bottom, #f5f7ff, #ffffff)";

    // Navbar container
    const navbarContent = document.createElement("div");
    navbarContent.className = "container-fluid d-flex align-items-center justify-content-between flex-wrap";

    // Example: Dynamic notifications data
    const notifications = [
        { title: "New Comment", message: "You have a new comment on your post." },
        { title: "System Alert", message: "Your password will expire in 3 days." },
    ];

    // Add the header navigation items (search bar, notification, and message icons)
    const headerNav = createHeaderNav(notifications);
    navbarContent.appendChild(headerNav);

    // Add the profile dropdown
    const profileDropdown = createProfileDropdown();
    navbarContent.appendChild(profileDropdown);

    // Append navbar content to the header
    header.appendChild(navbarContent);

    // Add a blue line at the bottom
    const blueLine = document.createElement("div");
    blueLine.style.backgroundColor = "#007BFF"; // Bootstrap primary blue color
    blueLine.style.height = "4px";
    blueLine.style.width = "100%";

    // Append header and blue line to the DOM
    document.body.prepend(blueLine);
    document.body.prepend(header);
});

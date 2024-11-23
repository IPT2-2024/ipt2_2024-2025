export default function createHeaderNav(notifications = []) {
    const navDiv = document.createElement("div");
    navDiv.className = "d-flex align-items-center flex-grow-1 flex-wrap";

    // Search Bar
    const searchForm = document.createElement("form");
    searchForm.className = "flex-grow-1 me-3 mb-2 mb-lg-0";

    const inputGroup = document.createElement("div");
    inputGroup.className = "input-group";

    const inputGroupText = document.createElement("span");
    inputGroupText.className = "input-group-text bg-white border-0";
    inputGroupText.innerHTML = '<i class="bi bi-search"></i>';

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.className = "form-control border-0 shadow-none";
    searchInput.style.background = "#ffffff";
    searchInput.placeholder = "Search";

    inputGroup.appendChild(inputGroupText);
    inputGroup.appendChild(searchInput);
    searchForm.appendChild(inputGroup);
    navDiv.appendChild(searchForm);

    // Notification Icon
    const notificationDiv = document.createElement("div");
    notificationDiv.className = "dropdown me-3";

    const notificationToggle = document.createElement("a");
    notificationToggle.href = "#";
    notificationToggle.className = "text-decoration-none";
    notificationToggle.setAttribute("data-bs-toggle", "dropdown");
    notificationToggle.innerHTML = '<i class="bi bi-bell"></i>';

    const notificationDropdown = document.createElement("ul");
    notificationDropdown.className = "dropdown-menu dropdown-menu-end shadow-sm";
    notificationDropdown.style.width = "300px";

    if (notifications.length === 0) {
        notificationDropdown.innerHTML = `<li class="dropdown-item text-muted text-center">No new notifications</li>`;
    } else {
        notifications.forEach(notification => {
            const notificationItem = document.createElement("li");
            notificationItem.className = "dropdown-item";
            notificationItem.innerHTML = `<strong>${notification.title}</strong><p class="small text-muted mb-0">${notification.message}</p>`;
            notificationDropdown.appendChild(notificationItem);
        });
    }

    notificationDiv.appendChild(notificationToggle);
    notificationDiv.appendChild(notificationDropdown);
    navDiv.appendChild(notificationDiv);

    // Message Icon
    const chatDiv = document.createElement("div");
    chatDiv.className = "dropdown me-3";

    const chatToggle = document.createElement("a");
    chatToggle.href = "#";
    chatToggle.className = "text-decoration-none";
    chatToggle.setAttribute("data-bs-toggle", "dropdown");
    chatToggle.innerHTML = '<i class="bi bi-send"></i>';

    const chatDropdown = document.createElement("ul");
    chatDropdown.className = "dropdown-menu dropdown-menu-end shadow-sm";
    chatDropdown.style.width = "300px";

    chatDropdown.innerHTML = `<li class="dropdown-item text-muted text-center">No new messages</li>`;

    chatDiv.appendChild(chatToggle);
    chatDiv.appendChild(chatDropdown);
    navDiv.appendChild(chatDiv);

    return navDiv;
}

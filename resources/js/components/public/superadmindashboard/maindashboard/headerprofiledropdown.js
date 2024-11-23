export default function createProfileDropdown() {
    // Create the dropdown container
    const profileDiv = document.createElement("div");
    profileDiv.className = "dropdown ms-3 d-flex align-items-center";

    // Profile Toggle
    const profileToggle = document.createElement("a");
    profileToggle.href = "#";
    profileToggle.className = "text-decoration-none dropdown-toggle";
    profileToggle.setAttribute("data-bs-toggle", "dropdown");
    profileToggle.setAttribute("aria-expanded", "false");

    // Circular Profile Icon
    const profileImg = document.createElement("img");
    profileImg.src = "https://via.placeholder.com/40"; // Replace with your avatar URL
    profileImg.alt = "User Avatar";
    profileImg.className = "rounded-circle";
    profileImg.width = 40;
    profileImg.height = 40;

    profileToggle.appendChild(profileImg);

    // Dropdown Menu
    const profileDropdown = document.createElement("ul");
    profileDropdown.className = "dropdown-menu dropdown-menu-end shadow-sm";

    const profileItem = document.createElement("li");
    profileItem.innerHTML = '<a class="dropdown-item" href="#"><i class="bi bi-person"></i> Profile</a>';

    const settingsItem = document.createElement("li");
    settingsItem.innerHTML = '<a class="dropdown-item" href="#"><i class="bi bi-gear"></i> Settings</a>';

    const divider = document.createElement("li");
    divider.innerHTML = '<hr class="dropdown-divider">';

    const logoutItem = document.createElement("li");
    logoutItem.innerHTML = '<a class="dropdown-item" href="#"><i class="bi bi-box-arrow-right"></i> Logout</a>';

    profileDropdown.appendChild(profileItem);
    profileDropdown.appendChild(settingsItem);
    profileDropdown.appendChild(divider);
    profileDropdown.appendChild(logoutItem);

    profileDiv.appendChild(profileToggle);
    profileDiv.appendChild(profileDropdown);

    return profileDiv;
}

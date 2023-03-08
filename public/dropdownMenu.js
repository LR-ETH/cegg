// Get the dropdown menu element
const dropdownMenu = document.querySelector(".profile .dropdown-menu");

// Add an event listener to the window object
window.addEventListener("click", function(event) {
  // If the target of the click event is not the dropdown menu or the profile element, hide the dropdown menu
  if (!dropdownMenu.contains(event.target) && !event.target.classList.contains("profile")) {
    dropdownMenu.style.display = "none";
  }
});

// Add an event listener to the profile element
document.querySelector(".profile").addEventListener("click", function() {
  // Toggle the display of the dropdown menu when the profile element is clicked
  dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
});

document.addEventListener('click', function(e) {
    var profile = document.querySelector('.profile');
    if (!profile.contains(e.target)) {
      var dropdownMenu = profile.querySelector('.dropdown-menu');
      dropdownMenu.style.display = 'none';
    }
  });
  
  var profile = document.querySelector('.profile');
  profile.addEventListener('mouseover', function() {
    var dropdownMenu = profile.querySelector('.dropdown-menu');
    dropdownMenu.style.display = 'inline-block';
  });
  
 
  
// let menuIcon = document.querySelector('#menu-icon')
// let navbar = document.querySelector('.navbar')

// let sections = document.querySelectorAll('section')
// let navLinks = document.querySelectorAll('head nav a')

// window.onscroll = () =>{
//     sections.forEach(sec => {
//         let top = window.scrollY;
//         let offset = sec.offsetTop - 150;
//         let height = sec.offsetHeight;
//         let id = sec.getAttribute('id');

//         if(top >= offset && top<offset+height){
//             navLinks.forEach(links =>{
//                 links.classList.remove('active');
//                 document.querySelector('head nav a[href"=' + id + ']').classList.add('active')
//             })

//         }
//     })
// }

// menuIcon.onclick = () =>{
//     menuIcon.classList.toggle('bx-x');
//     navbar.classList.toggle('active');
// }

document.addEventListener('DOMContentLoaded', function () {
    const portfolioSection = document.getElementById('portfolioSection');
    const contactSection = document.getElementById('contactSection');
    const educationSection = document.getElementById('skillsSection');
    const projectsSection = document.getElementById('projectsSection');
    const experienceSection = document.getElementById('experienceSection');
    document.getElementById('portfolioLink').addEventListener('click', function () {
        portfolioSection.style.display = 'block';
        contactSection.style.display = 'none';
        educationSection.style.display = 'none';
        projectsSection.style.display = 'none';
    });

    document.getElementById('contactLink').addEventListener('click', function () {
        portfolioSection.style.display = 'none';
        contactSection.style.display = 'block';
        educationSection.style.display = 'none';
        projectsSection.style.display = 'none';
    });

    document.getElementById('skillsLink').addEventListener('click', function () {
        portfolioSection.style.display = 'none';
        contactSection.style.display = 'none';
        educationSection.style.display = 'block';
        projectsSection.style.display = 'none';
    });
    document.getElementById('experienceLink').addEventListener('click', function () {
        portfolioSection.style.display = 'none';
        contactSection.style.display = 'none';
        experienceSection.style.display='block'
        educationSection.style.display = 'none';
        projectsSection.style.display = 'none';
    });

    document.getElementById('projectsLink').addEventListener('click', function () {
        portfolioSection.style.display = 'none';
        contactSection.style.display = 'none';
        educationSection.style.display = 'none';
        projectsSection.style.display = 'block';
    });
});
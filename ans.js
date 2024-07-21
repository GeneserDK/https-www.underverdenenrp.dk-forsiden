document.addEventListener("DOMContentLoaded", function() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const discordTagForm = document.getElementById('discord-tag-form');
    const discordTagSection = document.getElementById('discord-tag-section');
    const applicationsSection = document.getElementById('applications-section');
    const notificationSection = document.getElementById('notification');
    let discordTag = '';

    // Accordion functionality
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const accordionContent = accordionItem.querySelector('.accordion-content');

            if (accordionContent.style.display === 'block') {
                accordionContent.style.display = 'none';
                header.classList.remove('active');
            } else {
                accordionContent.style.display = 'block';
                header.classList.add('active');
            }
        });
    });

    // Discord Tag Form Submission
    discordTagForm.addEventListener('submit', function(e) {
        e.preventDefault();
        discordTag = document.getElementById('discord-tag').value;
        if (discordTag) {
            discordTagSection.style.display = 'none';
            applicationsSection.style.display = 'block';
        }
    });

    // Discord webhook functionality
    const forms = document.querySelectorAll('form[data-type]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const ageRestriction = parseInt(form.getAttribute('data-age-restriction'), 10);
            const userAge = parseInt(form.querySelector('input[name$="-age"]').value, 10);

            if (userAge < ageRestriction) {
                notificationSection.innerHTML = `
                    <div class="notification error">
                        Du skal være ${ageRestriction}+ år gammel for at ansøge om ${form.getAttribute('data-type')}.
                    </div>
                `;
                notificationSection.style.display = 'block';
                setTimeout(() => {
                    notificationSection.style.display = 'none';
                }, 5000); // Vis besked i 5 sekunder
                return;
            }

            const webhookURL = form.getAttribute('data-webhook');
            const formData = new FormData(form);
            const messageContent = {};
            const applicationType = form.getAttribute('data-type'); // Hent typen af ansøgning

            formData.forEach((value, key) => {
                messageContent[key] = value;
            });

            const message = JSON.stringify(messageContent, null, 2); // Formaterer som en pæn JSON-struktur

            const request = new XMLHttpRequest();
            request.open('POST', webhookURL);
            request.setRequestHeader('Content-type', 'application/json');

            const params = {
                content: `Ny ansøgning fra ${applicationType} af ${discordTag}:\n\`\`\`json\n${message}\n\`\`\``
            };

            request.send(JSON.stringify(params));
            request.onload = function() {
                if (request.status === 204) {
                    notificationSection.innerHTML = `
                        <div class="notification success">
                            Ansøgning sendt!
                        </div>
                    `;
                    notificationSection.style.display = 'block';
                    setTimeout(() => {
                        notificationSection.style.display = 'none';
                    }, 5000); // Vis besked i 5 sekunder

                    form.reset(); // Nulstiller formularen efter succesfuld afsendelse
                } else {
                    notificationSection.innerHTML = `
                        <div class="notification error">
                            Noget gik galt: ${request.statusText}
                        </div>
                    `;
                    notificationSection.style.display = 'block';
                    setTimeout(() => {
                        notificationSection.style.display = 'none';
                    }, 5000); // Vis besked i 5 sekunder
                }
            }
        });
    });
});

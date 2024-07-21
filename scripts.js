document.addEventListener('DOMContentLoaded', function() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Toggle active class for the header
            header.classList.toggle('active');

            // Toggle display for the content
            const content = header.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    });

    // Fetch server status
    const serverStatusDiv = document.getElementById('server-status');
    const serverInfoSpan = document.getElementById('server-info');

    const serverIP = '4ro7x9'; // Din server IP
    const cfxLink = `https://servers.fivem.net/servers/detail/${serverIP}`;

    fetch(`https://servers-frontend.fivem.net/api/servers/single/${serverIP}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.Data && data.Data.players) {
                const players = data.Data.players.length;
                const maxPlayers = data.Data.vars.sv_maxClients;
                serverInfoSpan.textContent = `${players} / ${maxPlayers}`;
                serverStatusDiv.href = cfxLink;
            } else {
                throw new Error('Ingen data fundet');
            }
        })
        .catch(error => {
            serverStatusDiv.classList.add('error');
            serverInfoSpan.textContent = 'Server ikke tilgængelig';
        });
});

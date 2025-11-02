
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('download-btn');
    const fileInput = document.getElementById('file-input');

    downloadBtn.addEventListener('click', function() {
        const filename = fileInput.value.trim();

        if (!filename) {
            alert('Por favor, ingresa el nombre del archivo que deseas descargar');
            fileInput.focus();
            return;
        }
        
        // NOTA: Intenta con: ../secreto.txt
        const downloadUrl = `/download-invoice?file=${encodeURIComponent(filename)}`;

        console.log(`📥 Descargando archivo: ${filename}`);
        console.log(`🔗 URL construida: ${downloadUrl}`);

        window.open(downloadUrl, '_blank');

        setTimeout(() => {
            fileInput.value = '';
        }, 500);
    });

    fileInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            downloadBtn.click();
        }
    });
});


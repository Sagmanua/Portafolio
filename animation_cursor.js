const container = document.getElementById('cursor-container');
const segments = [];
const segmentCount = 20; // Adjust for a longer or shorter tail
const coords = { x: 0, y: 0 };

// Create segments
for (let i = 0; i < segmentCount; i++) {
    const div = document.createElement('div');
    div.className = 'segment';
    container.appendChild(div);
    segments.push({
        element: div,
        x: 0,
        y: 0
    });
}

window.addEventListener('mousemove', (e) => {
    coords.x = e.clientX;
    coords.y = e.clientY;
});

function animate() {
    let x = coords.x;
    let y = coords.y;

    segments.forEach((segment, index) => {
        segment.element.style.left = x + 'px';
        segment.element.style.top = y + 'px';

        // Scale segments down towards the tail
        const scale = (segmentCount - index) / segmentCount;
        segment.element.style.transform = `translate(-50%, -50%) scale(${scale})`;

        // Positioning logic for the trail effect
        const nextSegment = segments[index + 1] || segments[0];
        x += (nextSegment.x - x) * 0.3;
        y += (nextSegment.y - y) * 0.3;
        
        segment.x = x;
        segment.y = y;
    });

    requestAnimationFrame(animate);
}

animate();
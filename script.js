// ===== Mobile Menu Toggle =====
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// ===== Charts Configuration =====

// Consumption Trend Chart
const consumptionCtx = document.getElementById('consumptionChart');
if (consumptionCtx) {
    const consumptionChart = new Chart(consumptionCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Current Week',
                    data: [1850, 1920, 1780, 2050, 1950, 1680, 1420],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                },
                {
                    label: 'Previous Week',
                    data: [1720, 1850, 1690, 1980, 1820, 1590, 1380],
                    borderColor: '#94a3b8',
                    backgroundColor: 'rgba(148, 163, 184, 0.05)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#94a3b8',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    borderDash: [5, 5],
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 12,
                            weight: '600'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    padding: 12,
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    titleFont: {
                        size: 14,
                        weight: '600'
                    },
                    bodyFont: {
                        size: 13
                    },
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + ' kWh';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(226, 232, 240, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ' kWh';
                        },
                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 11,
                            weight: '600'
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });

    // Time filter functionality
    const timeFilter = document.querySelector('.time-filter');
    if (timeFilter) {
        timeFilter.addEventListener('change', (e) => {
            const period = e.target.value;
            // In a real application, this would fetch new data based on the selected period
            console.log('Loading data for:', period);

            // Simulate data update
            const newData = generateRandomData(7);
            consumptionChart.data.datasets[0].data = newData;
            consumptionChart.update();
        });
    }
}

// Distribution Chart (Doughnut)
const distributionCtx = document.getElementById('distributionChart');
if (distributionCtx) {
    const distributionChart = new Chart(distributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Treatment Plants', 'Pump Stations', 'Office Buildings', 'Laboratories', 'Storage Facilities'],
            datasets: [{
                data: [35, 28, 18, 12, 7],
                backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#8b5cf6',
                    '#ef4444'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12,
                            weight: '600'
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: label + ' (' + data.datasets[0].data[i] + '%)',
                                fillStyle: data.datasets[0].backgroundColor[i],
                                hidden: false,
                                index: i
                            }));
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    padding: 12,
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    titleFont: {
                        size: 14,
                        weight: '600'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return label + ': ' + value + '%';
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });
}

// ===== Helper Functions =====

function generateRandomData(length) {
    return Array.from({ length }, () => Math.floor(Math.random() * 1000) + 1200);
}

// ===== Real-time Updates Simulation =====

function updateStats() {
    // Simulate real-time stat updates
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        // Add subtle pulse animation when data updates
        stat.style.animation = 'none';
        setTimeout(() => {
            stat.style.animation = 'pulse 0.5s ease';
        }, 10);
    });
}

// Update stats every 30 seconds
setInterval(updateStats, 30000);

// ===== Notification System =====

const notificationBtn = document.querySelector('.notification-btn');
if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
        // In a real application, this would show a notification dropdown
        alert('Notifications:\n\n• High consumption detected at Pump Station A\n• Equipment fault at Treatment Plant B\n• Peak demand alert at Distribution Center C');
    });
}

// ===== Export Functionality =====

const exportBtn = document.querySelector('.export-btn');
if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        // In a real application, this would export the chart data
        console.log('Exporting chart data...');

        // Simulate export
        const exportData = {
            date: new Date().toISOString(),
            data: {
                treatmentPlants: 35,
                pumpStations: 28,
                officeBuildings: 18,
                laboratories: 12,
                storageFacilities: 7
            }
        };

        // Create and download JSON file
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'energy-distribution-' + new Date().getTime() + '.json';
        link.click();
        URL.revokeObjectURL(url);
    });
}

// ===== Action Buttons in Table =====

const actionBtns = document.querySelectorAll('.action-btn');
actionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        const facility = row.cells[0].textContent;
        const alertType = row.cells[1].textContent;

        // In a real application, this would open a detailed view
        console.log('Viewing details for:', facility, '-', alertType);
        alert(`Alert Details\n\nFacility: ${facility}\nType: ${alertType}\n\nThis would open a detailed view in a real application.`);
    });
});

// ===== Progress Bar Animation =====

function animateProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    progressFills.forEach((fill, index) => {
        const width = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.width = width;
        }, 100 * index);
    });
}

// Animate progress bars on page load
window.addEventListener('load', () => {
    setTimeout(animateProgressBars, 500);
});

// ===== Search Functionality =====

const searchInput = document.querySelector('.search-box input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        if (searchTerm.length > 2) {
            // In a real application, this would filter the dashboard content
            console.log('Searching for:', searchTerm);
        }
    });
}

// ===== Keyboard Shortcuts =====

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Escape to close sidebar on mobile
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

// ===== Pulse Animation for Stats =====

const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
`;
document.head.appendChild(style);

// ===== Page Load Complete =====

console.log('WaterCorp Electricity Management System initialized successfully');
console.log('Dashboard loaded with', document.querySelectorAll('.stat-card').length, 'stat cards');

class Patient {
    constructor(name, age, disease, priority, previousVisit, nextVisit) {
        this.name = name;
        this.age = age;
        this.disease = disease;
        this.priority = priority;
        this.previousVisit = previousVisit;
        this.nextVisit = nextVisit;
    }
}

class HospitalQueue {
    constructor() {
        this.queue = [];
        this.treatedPatients = [];
    }

    addPatient(patient) {
        this.queue.push(patient);
        this.queue.sort((a, b) => a.priority - b.priority);
        this.updateQueueDisplay();
    }

    treatPatient() {
        if (this.queue.length === 0) {
            this.showPopup('No patients in queue', 'info');
            return null;
        }
        const treatedPatient = this.queue.shift();
        this.treatedPatients.push(treatedPatient);
        this.updateQueueDisplay();
        this.updateTreatedList();
        this.showPopup(
            `Treating patient: ${treatedPatient.name}`,
            treatedPatient.priority === 1 ? 'emergency' : 'normal',
            treatedPatient
        );
        return treatedPatient;
    }

    showPopup(message, type, patient = null) {
        // Remove any existing popup
        const existingPopup = document.querySelector('.popup-notification');
        if (existingPopup) {
            existingPopup.remove();
        }

        // Create new popup
        const popup = document.createElement('div');
        popup.className = `popup-notification ${type}`;
        
        let content = message;
        if (patient) {
            content = `
                <div class="popup-header">
                    <div class="popup-title">Patient Treatment</div>
                    <button class="popup-close">&times;</button>
                </div>
                <div class="popup-content">
                    <strong>Name:</strong> ${patient.name}<br>
                    <strong>Age:</strong> ${patient.age}<br>
                    <strong>Disease:</strong> ${patient.disease}<br>
                    <strong>Priority:</strong> ${patient.priority === 1 ? 'Emergency' : 'Normal'}<br>
                    <strong>Previous Visit:</strong> ${patient.previousVisit === 'first' ? 'First Visit' : 'Follow-up Visit'}<br>
                    <strong>Next Visit:</strong> ${new Date(patient.nextVisit).toLocaleDateString()}
                </div>
            `;
        } else {
            content = `
                <div class="popup-header">
                    <div class="popup-title">Notification</div>
                    <button class="popup-close">&times;</button>
                </div>
                <div class="popup-content">${message}</div>
            `;
        }
        
        popup.innerHTML = content;
        document.body.appendChild(popup);

        // Show popup
        setTimeout(() => popup.classList.add('show'), 10);

        // Add close button functionality
        const closeBtn = popup.querySelector('.popup-close');
        closeBtn.addEventListener('click', () => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        });

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        }, 3000);
    }

    updateQueueDisplay() {
        const queueList = document.getElementById('queueList');
        queueList.innerHTML = '';
        
        if (this.queue.length === 0) {
            queueList.innerHTML = '<div class="empty-message">No patients in queue</div>';
            return;
        }
        
        this.queue.forEach(patient => {
            const patientItem = document.createElement('div');
            patientItem.className = `patient-item ${patient.priority === 1 ? 'emergency' : 'normal'}`;
            patientItem.innerHTML = `
                <strong>Name:</strong> ${patient.name}<br>
                <strong>Age:</strong> ${patient.age}<br>
                <strong>Disease:</strong> ${patient.disease}<br>
                <strong>Priority:</strong> ${patient.priority === 1 ? 'Emergency' : 'Normal'}<br>
                <strong>Previous Visit:</strong> ${patient.previousVisit === 'first' ? 'First Visit' : 'Follow-up Visit'}<br>
                <strong>Next Visit:</strong> ${new Date(patient.nextVisit).toLocaleDateString()}
            `;
            queueList.appendChild(patientItem);
        });
    }

    updateTreatedList() {
        const treatedList = document.getElementById('treatedList');
        if (!treatedList) {
            // Create treated list container if it doesn't exist
            const container = document.querySelector('.queue-container');
            const treatedContainer = document.createElement('div');
            treatedContainer.className = 'treated-container';
            treatedContainer.innerHTML = `
                <h2>Treated Patients</h2>
                <div id="treatedList"></div>
            `;
            container.parentNode.insertBefore(treatedContainer, container.nextSibling);
        }

        const treatedListElement = document.getElementById('treatedList');
        treatedListElement.innerHTML = '';
        
        if (this.treatedPatients.length === 0) {
            treatedListElement.innerHTML = '<div class="empty-message">No patients treated yet</div>';
            return;
        }

        this.treatedPatients.forEach(patient => {
            const treatedItem = document.createElement('div');
            treatedItem.className = `treated-item ${patient.priority === 1 ? 'emergency' : 'normal'}`;
            const time = new Date().toLocaleTimeString();
            
            // Create each detail row
            const nameRow = document.createElement('div');
            nameRow.className = 'patient-detail-row';
            nameRow.innerHTML = `
                <div class="detail-label">Name:</div>
                <div class="detail-value">${patient.name}</div>
            `;

            const ageRow = document.createElement('div');
            ageRow.className = 'patient-detail-row';
            ageRow.innerHTML = `
                <div class="detail-label">Age:</div>
                <div class="detail-value">${patient.age}</div>
            `;

            const priorityRow = document.createElement('div');
            priorityRow.className = 'patient-detail-row';
            priorityRow.innerHTML = `
                <div class="detail-label">Priority:</div>
                <div class="detail-value">${patient.priority === 1 ? 'Emergency' : 'Normal'}</div>
            `;

            const diseaseRow = document.createElement('div');
            diseaseRow.className = 'patient-detail-row';
            diseaseRow.innerHTML = `
                <div class="detail-label">Disease:</div>
                <div class="detail-value">${patient.disease}</div>
            `;

            const timeRow = document.createElement('div');
            timeRow.className = 'patient-detail-row treatment-time';
            timeRow.innerHTML = `
                <div class="detail-label">Treated at:</div>
                <div class="detail-value">${time}</div>
            `;

            // Append all rows to the treated item
            treatedItem.appendChild(nameRow);
            treatedItem.appendChild(ageRow);
            treatedItem.appendChild(priorityRow);
            treatedItem.appendChild(diseaseRow);
            treatedItem.appendChild(timeRow);

            treatedListElement.appendChild(treatedItem);
        });
    }
}

// Initialize the hospital queue
const hospitalQueue = new HospitalQueue();

// Add event listener for the patient form
document.getElementById('patientForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const age = parseInt(document.getElementById('age').value);
    const disease = document.getElementById('disease').value;
    const priority = parseInt(document.getElementById('priority').value);
    const previousVisit = document.getElementById('previousVisit').value;
    const nextVisit = document.getElementById('nextVisit').value;
    
    const patient = new Patient(name, age, disease, priority, previousVisit, nextVisit);
    hospitalQueue.addPatient(patient);
    
    // Reset form
    this.reset();
});

// Add event listener for the treat button
document.getElementById('treatBtn').addEventListener('click', function() {
    const treatedPatient = hospitalQueue.treatPatient();
});

// Add input validation
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement.tagName !== 'BUTTON') {
        document.getElementById('patientForm').dispatchEvent(new Event('submit'));
    }
    if (e.key === 't' && e.ctrlKey) {
        document.getElementById('treatBtn').click();
    }
}); 
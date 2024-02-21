class App {
    constructor() {
        this.$form = document.querySelector('#form'); // var starts with $ meaning it is a html element
        this.$noteTitle = document.querySelector('#note-title');
        this.$noteText = document.querySelector("#note-text");
        this.$formButtons = document.querySelector('#form-buttons');
        this.$formCloseButton = document.querySelector('#form-close-button');
        this.$placeholder = document.querySelector('#placeholder');
        this.$notes = document.querySelector('#notes');

        /* Modal for selected note */
        this.$modal = document.querySelector(".modal");
        this.$modalTitle = document.querySelector(".modal-title");
        this.$modalText = document.querySelector(".modal-text");
        this.$modalCloseButton = document.querySelector('.modal-close-button');
        this.$colorTooltip = document.querySelector('#color-tooltip');

        /* Data related variables */
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.title = ''; // for selected note
        this.text = ''; // for selected note
        this.id = ''; // for selected note

        this.addEventListeners(); // Add event listener in constructor
        this.render(); // Display the saved note first loading
    }

    addEventListeners(){
        // click the form appear and disappear click away
        document.body.addEventListener('click', event =>{
            this.handleFormClick(event);
            this.selectNote(event);
            this.openModal(event); // open the note detail after clicking it
            this.deleteNote(event); // delete note
        })

        // sumit event, add new note
        this.$form.addEventListener('submit', event =>{
            event.preventDefault(); // prevent default event when submit, so there is no refresh, the form stay open
            this.submit();
        })

        // close button 
        this.$formCloseButton.addEventListener('click', event =>{
            event.stopPropagation(); 
            /*
             Close button when click, will also call the 
            document.body.addEventListener('click', event) and then handleFormClick(event) to open the form
            So we call .stopPropagation() to prevent the event propogate 
            */
            this.closeForm();
        })

        this.$modalCloseButton.addEventListener('click', event => {
            this.closeModal(event);  
        })

        // Open/close tooltip
        document.body.addEventListener('mouseover', event => {
            this.openTooltip(event);  
        });

        document.body.addEventListener('mouseout', event => {
            this.closeTooltip(event);  
        });

        this.$colorTooltip.addEventListener('mouseover', function() { // use function() to reference this, arrow functon does not have this
            this.style.display = 'flex';  
        })
        
        this.$colorTooltip.addEventListener('mouseout',  function() {
            this.style.display = 'none'; 
        })
        
        // Change note color
        this.$colorTooltip.addEventListener('click', event => {
            const color = event.target.dataset.color; 
            if (color) {
                this.editNoteColor(color);  
            }
        })
    }

    handleFormClick(event) {
        const isFormClicked = this.$form.contains(event.target); 
        // event.target is exactly the html element that got clicked, like title, text and buttons

        if (isFormClicked) {
            this.openForm();
        } else {
            this.submit();
            this.closeForm();
        }
    }
      
    openForm() {
        this.$form.classList.add('form-open');  
        this.$noteTitle.style.display = 'block';
        this.$formButtons.style.display = 'block';
    }
      
    closeForm() {
        this.$form.classList.remove('form-open');  
        this.$noteTitle.style.display = 'none';
        this.$formButtons.style.display = 'none';  
    }

    submit() {
        const title = this.$noteTitle.value;   
        const text = this.$noteText.value;          
        const hasNode = title || text; // when both has text
        if(hasNode){
            this.$noteTitle.value = '';
            this.$noteText.value = '';
            this.addNote(title, text); 
        }   
    }

    addNote(title, text) {
        const newNote = {
            title,
            text,
            color: 'white',
            id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
        };

        this.notes = [...this.notes, newNote];
        this.render(); // Show all the notes
    }

    editNote() {
        const title = this.$modalTitle.value;
        const text = this.$modalText.value;
        this.notes = this.notes.map(note =>
            note.id === Number(this.id) ? { ...note, title, text } : note
        )

        this.render(); // Call to update the ui, otherwise it won't update
    }

    render() {
        this.saveNotes();
        this.displayNotes();  
    }
      
    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes))  
    }

    displayNotes(){
        // Hide the empty note placeholder
        const hasNode = this.notes.length > 0;
        this.$placeholder.style.display = hasNode? 'none': 'flex';
        this.$notes.innerHTML = this.notes.map(note => `
            <div style="background: ${note.color};" class="note" data-idd="${note.id}">
                <div class="${note.title && 'note-title'}">${note.title}</div>
                <div class="note-text">${note.text}</div>
                <div class="toolbar-container">
                    <div class="toolbar">
                    <img class="toolbar-color" data-id="${note.id}" src="https://icon.now.sh/palette">
                    <img class="toolbar-delete" data-id="${note.id}" src="https://icon.now.sh/delete">
                    </div>
                </div>
            </div>
        `).join(""); // join the array to string, or there will be a , at end of each element
        // data-* attributes: When you access .dataset.id on an element, JavaScript looks for an attribute with the name data-id on that element. The value of this attribute is then returned. 
    }

    openModal(event){
        if(event.target.matches('.toolbar-delete')) return;  
        if(event.target.closest(".note")){
            this.$modal.classList.toggle("open-modal"); // toggle class name, so we can open and hide mode
            this.$modalTitle.value = this.title;
            this.$modalText.value = this.text;
        }
    }

    closeModal(event){
        this.editNote();
        this.$modal.classList.toggle('open-modal'); // Toggle class to hide modal.
    }

    selectNote(event) {
        const $selectedNote = event.target.closest('.note');
        if (!$selectedNote) return;
        const [$noteTitle, $noteText] = $selectedNote.children; // Use array destructuring to select children node
        this.title = $noteTitle.innerText;
        this.text = $noteText.innerText;
        this.id = $selectedNote.dataset.idd; // Get id so we can update target note in notes
    }

    openTooltip(event){
        if (!event.target.matches('.toolbar-color')) return;
        this.id = event.target.dataset.id;
        const noteCoords = event.target.getBoundingClientRect();
        const horizontal = window.scrollX + noteCoords.left;
        const vertical = window.scrollY + noteCoords.top;
        this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
        this.$colorTooltip.style.display = 'flex';        
    }

    closeTooltip(event) {
        if (!event.target.matches('.toolbar-color')) return;
        this.$colorTooltip.style.display = 'none';  
    }

    editNoteColor(color) {
        this.notes = this.notes.map(note =>
            note.id === Number(this.id) ? { ...note, color } : note
        );
        this.render();
    }

    deleteNote(event) {
        // event.stopPropagation(); // you do not need stop propagation cause you added a condition at openModal()
        if(!event.target.matches('.toolbar-delete')) return;
        const id = event.target.dataset.id;
        this.notes = this.notes.filter(note => note.id !== Number(id));
        this.render();
    }
  }
  
  new App();
  
class App {
    constructor() {
        this.$form = document.querySelector('#form'); // var starts with $ meaning it is a html element
        this.$noteTitle = document.querySelector('#note-title');
        this.$noteText = document.querySelector("#note-text");
        this.$formButtons = document.querySelector('#form-buttons');
        this.$formCloseButton = document.querySelector('#form-close-button');
        this.$placeholder = document.querySelector('#placeholder');
        this.$notes = document.querySelector('#notes');

        /* Data related variables */
        this.notes = [];

        this.addEventListeners(); // Add event listener in constructor
    }

    addEventListeners(){
        // click the form appear and disappear click away
        document.body.addEventListener('click', event =>{
            this.handleFormClick(event);
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
        this.displayNotes(); // Show all the notes
    }

    displayNotes(){
        // Hide the empty note placeholder
        const hasNode = this.notes.length > 0;
        this.$placeholder.style.display = hasNode? 'none': 'flex';
        this.$notes.innerHTML = this.notes.map(note => `
            <div style="background: ${note.color};" class="note">
                <div class="${note.title && 'note-title'}">${note.title}</div>
                <div class="note-text">${note.text}</div>
                <div class="toolbar-container">
                    <div class="toolbar">
                    <img class="toolbar-color" src="https://icon.now.sh/palette">
                    <img class="toolbar-delete" src="https://icon.now.sh/delete">
                    </div>
                </div>
            </div>
        `).join(""); // without join the array to string, there will be a , at end of each element
    }

  }
  
  new App();
  
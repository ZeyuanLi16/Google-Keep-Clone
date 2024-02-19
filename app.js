class App {
    constructor() {
        this.$form = document.querySelector('#form'); // var starts with $ meaning it is a html element
        this.$noteTitle = document.querySelector('#note-title');
        this.$noteText = document.querySelector("#note-text");
        this.$formButtons = document.querySelector('#form-buttons');
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
        document.body.addEventListener('submit', event =>{
            event.preventDefault(); // prevent default event when submit, so there is no refresh, the form stay open
            const title = this.$noteTitle.value;   
            const text = this.$noteText.value;          
            this.$noteTitle.value = '';
            this.$noteText.value = '';
            const hasNode = title || text; // when both has text
            if(hasNode){
                this.addNote({ title, text }); // pass in as object, instead of parameter
            }   
        })
    }

    handleFormClick(event) {
        const isFormClicked = this.$form.contains(event.target); 
        // event.target is exactly the html element that got clicked, like title, text and buttons
        
        if (isFormClicked) {
            this.openForm();
        } else {
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

    addNote(note) {
        const newNote = {
            title: note.title,
            text: note.text,
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
  
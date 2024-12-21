const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
  ];

const initialData = {
    name: 'Wall-E',
    ticket: 1,
    // `about` is a Delta object
    // Learn more at: https://quilljs.com/docs/delta
    about: [
      {
        insert:
          'A robot who has developed sentience, and is the only robot of his kind shown to be still functioning on Earth.\n',
      },
    ],
  };
  
  const quill1 = new Quill('#Q1', {
    modules: {
        toolbar : toolbarOptions,
            
    //   toolbar: [
    //     ['bold', 'italic'],
    //     ['link', 'blockquote', 'code-block', 'image'],
    //     [{ list: 'ordered' }, { list: 'bullet' }],
    //   ],
    },
    theme: 'snow',
  });

  const quill2 = new Quill('#Q2', {
    modules: {
        toolbar : toolbarOptions,
            
    //   toolbar: [
    //     ['bold', 'italic'],
    //     ['link', 'blockquote', 'code-block', 'image'],
    //     [{ list: 'ordered' }, { list: 'bullet' }],
    //   ],
    },
    theme: 'snow',
  });

  const resetForm = () => {
    document.querySelector('[name="name"]').value = initialData.name;
    document.querySelector('[name="ticket"]').value = initialData.location;
    quill1.setContents(initialData.about);
  };
  
  resetForm();
  
  const form = document.querySelector('form');
  form.addEventListener('formdata', (event) => {
    // Append Quill content before submitting
    event.formData.append('Q1', JSON.stringify(quill1.getContents().ops));
    event.formData.append('Q2', JSON.stringify(quill2.getContents().ops));
  });
  
  document.querySelector('#resetForm').addEventListener('click', () => {
    resetForm();
  });
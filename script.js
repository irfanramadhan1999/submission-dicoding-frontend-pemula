const books = [];
const RENDER_EVENT = "render-book";
const SIMPAN_EVENT = 'saved-book';
const KUNCIKU = "Bookshelf";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (cekBrowser()){
    muatData();
  }
});

function saveData(){
  if(cekBrowser()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(KUNCIKU, parsed);
    document.dispatchEvent(new Event(SIMPAN_EVENT));
  }
}

function cekBrowser(){
  if(typeof (Storage) === undefined){
    alert('browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function muatData(){
  const serializedData = localStorage.getItem(KUNCIKU);
  let data = JSON.parse(serializedData);

  if (data !== null) {
      data.forEach((book) => {
      books.unshift(book);
    });
    document.dispatchEvent(new Event(RENDER_EVENT));
    return books;
    }
  }

document.addEventListener(SIMPAN_EVENT, function () {
  console.log(localStorage.getItem(KUNCIKU));
});

function addBook() {
  const inputBookTitle = document.getElementById("inputBookTitle").value;
  const inputBookAuthor = document.getElementById("inputBookAuthor").value;
  const inputBookYear = document.getElementById("inputBookYear").value;
  const inputBookIsComplete = document.getElementById(
    "inputBookIsComplete"
  ).checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    inputBookTitle,
    inputBookAuthor,
    inputBookYear,
    inputBookIsComplete
  );
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(
  id,
  inputBookTitle,
  inputBookAuthor,
  inputBookYear,
  inputBookIsComplete
) {
  return {
    id,
    inputBookTitle,
    inputBookAuthor,
    inputBookYear,
    inputBookIsComplete,
  };
}

function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.inputBookTitle;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = bookObject.inputBookAuthor;

  const textYear = document.createElement("p");
  textYear.innerText = bookObject.inputBookYear;

  const textContainer = document.createElement("article");
  textContainer.classList.add("book_item");
  textContainer.append(textTitle, textAuthor, textYear);
  textContainer.setAttribute("id", bookObject.id);
  
}

function switchBook(bookId){

  for(const index in books){
    if(books[index].id === bookId){
      if(books[index].inputBookIsComplete === true){
        books[index].inputBookIsComplete = false;
      }else{
        books[index].inputBookIsComplete = true;
      }
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBook(bookId){
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId){
  for (const index in books){
    if(books[index].id === bookId){
      return index;
    }
  }

  return -1;
}



document.addEventListener(RENDER_EVENT, function () {
  // console.log(makebook(books));

  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  books.forEach((e) => {
    if (e.inputBookIsComplete == false) {
      let element = `
      <article class="book_item">
      <h3>${e.inputBookTitle}</h3>
      <p>Penulis: ${e.inputBookAuthor}</p>
      <p>Tahun: ${e.inputBookYear}</p>
      <div>
        <button type="button" onclick="switchBook(${e.id})">Selesai Dibaca</button>
        <button type="button" onclick="deleteBook(${e.id})">Hapus Buku</button>
      </div>
      </article>
      `;

      incompleteBookshelfList.innerHTML += element;
    }else{
      let element = `
      <article class="book_item">
      <h3>${e.inputBookTitle}</h3>
      <p>Penulis: ${e.inputBookAuthor}</p>
      <p>Tahun: ${e.inputBookYear}</p>
      <div>
        <button type="button" onclick="switchBook(${e.id})">Belum Selesai Dibaca</button>
        <button type="button" onclick="deleteBook(${e.id})">Hapus Buku</button>
      </div>
      </article>
      `;

      completeBookshelfList.innerHTML += element;
    }
  });
});

const containerAvailableBooks = document.querySelector("#booksAvailable");
const containerReservedBooks = document.querySelector("#reservedBooks");
let availableBooks = [];
let reservedBooks = [];

const getData = async () => {
  const response = await fetch("https://api.itbook.store/1.0/new");
  const { books } = await response.json();
  return books;
};

const createBookCard = ({ isbn13, title, image }, isReserved) => {
  const element = $(`
    <div class="card mb-1 mt-1 p-0" id=${isbn13}>
      <div class="row g-0 h-100">
        <div class="col-3 image-container">
          <img
            src="${image}"
            class="img-fluid rounded-start card-image"
            alt="book image"
          />
        </div>
        <div class="col-7">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
          </div>
        </div>
        <div class="col-2 d-flex">
          ${
            !isReserved
              ? `
          <button class="btn card-button" onClick=bookBook(${isbn13})>
            +
          </button>
            `
              : `
          <button class="btn card-button" onClick=cancelBooking(${isbn13})>
            x
          </button>
            `
          }
         
        </div>
      </div>
    </div>
  `);

  return element;
};

const bookBook = (id) => {
  const selectedBook = findBook(availableBooks, id);
  deleteFromAvailables(id);
  addToReserved(selectedBook);
};

const findBook = (books, id) => {
  const book = books.find((book) => book.isbn13 == id);
  return book;
};

const deleteFromAvailables = (id) => {
  availableBooks = availableBooks.filter((book) => book.isbn13 != id);
  resetSection(containerAvailableBooks);
  addBooksToSection(containerAvailableBooks, availableBooks);
};

const cancelBooking = (id) => {
  const book = findBook(reservedBooks, id);
  reservedBooks = reservedBooks.filter((book) => book.isbn13 != id);
  resetSection(containerReservedBooks);
  addBooksToSection(containerReservedBooks, reservedBooks, true);
  availableBooks.push(book);
  addBooksToSection(containerAvailableBooks, [book]);
};

const resetSection = (section) => {
  $(section).html("");
};

const addBooksToSection = (section, books, isReserved = false) => {
  books.forEach((book) => {
    const card = createBookCard(book, isReserved);
    card.appendTo(section);
  });
};

const addToReserved = (book) => {
  reservedBooks.push(book);
  addBooksToSection(containerReservedBooks, [book], true);
};

const start = async () => {
  availableBooks = await getData();
  addBooksToSection(containerAvailableBooks, availableBooks);
};

start();

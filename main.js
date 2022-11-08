const API = "http://localhost:8000/students";

let first = document.querySelector("#first");
let name = document.querySelector("#name");
let numphone = document.querySelector("#num-phone");
let weeklyKPI = document.querySelector("#weekly-KPI");
let monthlyKPI = document.querySelector("#monthly-KPI");
let btnAdd = document.querySelector("#btn-add");
let list = document.querySelector("#product-list");

let editFirst = document.querySelector("#edit-First");
let editName = document.querySelector("#edit-Name");
let editNumphone = document.querySelector("#edit-Numphone");
let editWeeklyKPI = document.querySelector("#edit-WeeklyKPI");
let editMonthlyKPI = document.querySelector("#edit-MonthlyKPI");
let editbtnAdd = document.querySelector("#edit-btn-add");
let editSaveBtn = document.querySelector("#btn-save-edit");
let exampleModal = document.querySelector("#exampleModal");
//! SEARCH
let searchInp = document.querySelector("#search");
let searchVal = "";

//! PAGINATION
let currentPage = 1;
let pageTotalCount = 1;
let paginationList = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

btnAdd.addEventListener("click", async function () {
  let obj = {
    first: first.value,
    name: name.value,
    numphone: numphone.value,
    weeklyKPI: weeklyKPI.value,
    monthlyKPI: monthlyKPI.value,
  };
  if (
    !obj.first.trim() ||
    !obj.name.trim() ||
    !obj.numphone.trim() ||
    !obj.weeklyKPI.trim() ||
    !obj.monthlyKPI.trim()
  ) {
    alert("заполнить поля");
    return;
  }

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(obj),
  });

  first.value = "";
  name.value = "";
  numphone.value = "";
  weeklyKPI.value = "";
  monthlyKPI.value = "";
  render();
});

async function render() {
  let products = await fetch(
    `${API}?q=${searchVal}&_page=${currentPage}&_limit=2`
  )
    .then((res) => res.json())
    .catch((err) => console.log(err));

  drawPaginationButtons();
  list.innerHTML = "";
  products.forEach((element) => {
    let newElem = document.createElement("div");
    newElem.id = element.id;

    newElem.innerHTML = `<div class="card m-3"  style="width: 18rem;" >
      <div class="card-body">
      <h5 class="card-title">${element.first}</h5>
      <p class="card-text">${element.name}</p>
      <p class="card-text">${element.numphone}</p>
      <p class="card-text">${element.weeklyKPI}</p>
      <p class="card-text">${element.monthlyKPI}</p>
      <a href="#" id=${element.id} onclick="deleteProduct(${element.id})" class="btn btn-dark btn-delete"> DELETE</a>
      <a href="#" id=${element.id} data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-primary btn-edit "> EDIT</a>
      </div>
      </div>`;
    list.append(newElem);
  });
}
render();

function drawPaginationButtons() {
  fetch(`${API}?q=${searchVal}`)
    .then((res) => res.json())
    .then((data) => {
      pageTotalCount = Math.ceil(data.length / 2);

      paginationList.innerHTML = "";
      for (let i = 1; i <= pageTotalCount; i++) {
        if (currentPage == i) {
          let page1 = document.createElement("li");
          page1.innerHTML = `<li class="page-item active"><a class="page-link page_number" href="#">${i}</a><li>`;
          paginationList.append(page1);
        } else {
          let page1 = document.createElement("li");
          page1.innerHTML = `<li class="page-item"><a class="page-link page_number" href="#">${i}</a><li>`;
          paginationList.append(page1);
        }
      }

      if (currentPage == 1) {
        prev.classList.add("disabled");
      } else {
        prev.classList.remove("disabled");
      }

      if (currentPage == pageTotalCount) {
        next.classList.add("disabled");
      } else {
        next.classList.remove("disabled");
      }
    });
}

//! кнопка переключения на предыдущую страницу
prev.addEventListener("click", () => {
  if (currentPage <= 1) {
    return;
  }
  currentPage--;
  render();
});

//! кнопка переключения на предыдущую страницу

next.addEventListener("click", () => {
  if (currentPage >= pageTotalCount) {
    return;
  }

  currentPage++;
  render();
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("page_number")) {
    currentPage = e.target.innerText;
  }
  render();
});

function deleteProduct(id) {
  fetch(`${API}/${id}`, {
    method: "DELETE",
  }).then(() => render());
}

//! редактирование продукта
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editFirst.value = data.first;
        editName.value = data.name;
        editNumphone.value = data.numphone;
        editWeeklyKPI.value = data.weeklyKPI;
        editMonthlyKPI.value = data.monthlyKPI;

        editSaveBtn.setAttribute("id", data.id);
      });
  }
});

editSaveBtn.addEventListener("click", function () {
  let id = this.id;
  let first = editFirst.value;
  let name = editName.value;
  let numphone = editNumphone.value;
  let weeklyKPI = editWeeklyKPI.value;
  let monthlyKPI = editMonthlyKPI.value;

  if (!first || !name || !numphone || !weeklyKPI || !monthlyKPI) return;

  let editedProduct = {
    first: first,
    name: name,
    numphone: numphone,
    weeklyKPI: weeklyKPI,
    monthlyKPI: monthlyKPI,
  };

  saveEdit(editedProduct, id);
});

function saveEdit(editedProduct, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedProduct),
  }).then(() => {
    render();
  });

  let modal = bootstrap.Modal.getInstance(exampleModal);
  modal.hide();
}

//! search

searchInp.addEventListener("input", () => {
  searchVal = searchInp.value;
  render();
});

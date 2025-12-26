async function loadAdminData() {
  const res = await fetch("/admin/api/data");
  const data = await res.json();

  loadTable("usersTable", data.users, ["firstName", "lastName", "email", "phone"]);
  loadTable("contactsTable", data.contacts, ["firstName", "email", "subject", "message"]);
  loadTable("reportsTable", data.reports, ["name", "location", "description", "contact"]);
  loadTable("locationsTable", data.locations, ["userId", "latitude", "longitude", "timestamp"]);
  loadTable("sosTable", data.sos, ["number", "createdAt"]);
}

function loadTable(id, items, fields) {
  let table = document.getElementById(id);
  table.innerHTML = "";

  // Header
  let header = "<tr>";
  fields.forEach(f => header += `<th>${f}</th>`);
  header += "</tr>";
  table.innerHTML += header;

  // Rows
  items.forEach(item => {
    let row = "<tr>";
    fields.forEach(f => row += `<td>${item[f]}</td>`);
    row += "</tr>";
    table.innerHTML += row;
  });
}

loadAdminData();


async function loadContacts() {
  const res = await fetch("http://localhost:5000/api/contacts");
  const contacts = await res.json();

  const tbody = document.querySelector("#contactsTable tbody");
  tbody.innerHTML = "";

  contacts.forEach(c => {
    const row = `
      <tr>
        <td>${c.firstName} ${c.lastName}</td>
        <td>${c.email}</td>
        <td>${c.phone || "-"}</td>
        <td>${c.subject}</td>
        <td>${c.message}</td>
        <td>${new Date(c.createdAt).toLocaleString()}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

loadContacts();



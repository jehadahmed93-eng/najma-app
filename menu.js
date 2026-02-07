// menu.js

const sideMenu = document.getElementById("sideMenu");

// قاعدة بيانات مؤقتة
let families = [];

// عرض الأسر
function showFamilies() {
    let container = document.querySelector(".container");
    container.innerHTML = "";
    if(families.length === 0){
        container.innerHTML = "<p>لا توجد أسر مسجلة بعد.</p>";
        return;
    }
    families.forEach((fam, idx) => {
        const div = document.createElement("div");
        div.className = "section";
        div.innerHTML = `
            <h3>العائلة ${idx+1}: ${fam.headName}</h3>
            <p>رقم الهوية: ${fam.id}</p>
            <p>عدد الأفراد: ${fam.total}</p>
            <p>رقم الجوال: ${fam.mobile}</p>
        `;
        container.appendChild(div);
    });
}

// فلترة البيانات
function filterData() {
    let keyword = prompt("أدخل كلمة البحث (اسم، حالة اجتماعية، مرض، عمر...)");
    if(!keyword) return;

    const results = families.filter(fam => {
        return Object.values(fam).some(val => 
            val.toString().toLowerCase().includes(keyword.toLowerCase())
        );
    });

    let container = document.querySelector(".container");
    container.innerHTML = "<h3>نتائج البحث</h3>";

    if(results.length === 0){
        container.innerHTML += "<p>لا توجد نتائج مطابقة.</p>";
        return;
    }

    results.forEach((fam, idx) => {
        const div = document.createElement("div");
        div.className = "section";
        div.innerHTML = `
            <h3>العائلة ${idx+1}: ${fam.headName}</h3>
            <p>رقم الهوية: ${fam.id}</p>
            <p>عدد الأفراد: ${fam.total}</p>
            <p>رقم الجوال: ${fam.mobile}</p>
        `;
        container.appendChild(div);
    });
}

// باقي القوائم
function showDepartedFamilies(){ alert("العائلات المغادرة"); }
function importExcel(){ alert("استيراد Excel"); }
function exportExcel(){ alert("تصدير Excel"); }
function aboutApp(){ alert("حول التطبيق"); }
function contactUs(){ alert("تواصل معنا"); }

// ربط القائمة الجانبية
const menuToggle = document.getElementById("menuToggle");
menuToggle.onclick = (e) => { sideMenu.style.right="0"; e.stopPropagation(); }

document.addEventListener('click', function(e){
  if(!sideMenu.contains(e.target) && e.target!==menuToggle){
    sideMenu.style.right="-100%";
  }
});

document.querySelectorAll("#sideMenu ul li").forEach((item,index)=>{
    item.onclick = (e) => {
        switch(index){
            case 0: showFamilies(); break;
            case 1: filterData(); break;
            case 2: showDepartedFamilies(); break;
            case 3: importExcel(); break;
            case 4: exportExcel(); break;
            case 5: aboutApp(); break;
            case 6: contactUs(); break;
        }
        sideMenu.style.right="-100%";
        e.stopPropagation();
    }
});

// ===== Excel Export Styling (RTL + Header Color + Index Column) =====
window._reportsExportXlsx = function (sheetName, fileName, data) {
  if (!window.XLSX) { alert("مكتبة Excel (XLSX) غير محمّلة"); return; }
  if (!data || !data.length) { alert("لا توجد بيانات للتصدير"); return; }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data, { skipHeader: false });

  // RTL view
  ws["!view"] = [{ rightToLeft: true }];

  // ✅ لازم ARGB (8 خانات)
  const headerArgb = "FF2F3E4E";
  const whiteArgb  = "FFFFFFFF";
  const blackArgb  = "FF000000";

  const headerStyle = {
    font: { name: "Arial", sz: 14, bold: true, color: { rgb: whiteArgb } },
    alignment: { horizontal: "right", vertical: "center" },
    fill: { patternType: "solid", fgColor: { rgb: headerArgb } }
  };

  const indexColStyle = {
    font: { name: "Arial", sz: 14, bold: true, color: { rgb: whiteArgb } },
    alignment: { horizontal: "center", vertical: "center" },
    fill: { patternType: "solid", fgColor: { rgb: headerArgb } }
  };

  const normalStyle = {
    font: { name: "Arial", sz: 14, color: { rgb: blackArgb } },
    alignment: { horizontal: "right", vertical: "center" }
  };

  // Apply styles
  const ref = ws["!ref"];
  if (ref) {
    const range = XLSX.utils.decode_range(ref);
    for (let r = range.s.r; r <= range.e.r; r++) {
      for (let c = range.s.c; c <= range.e.c; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        const cell = ws[addr];
        if (!cell) continue;

        if (r === 0) cell.s = headerStyle;        // صف العناوين
        else if (c === 0) cell.s = indexColStyle; // العمود الأول (*)
        else cell.s = normalStyle;                // باقي الخلايا
      }
    }
  }

  // Auto column widths (تقريبي)
  const headers = Object.keys(data[0] || {});
  ws["!cols"] = headers.map(h => {
    let wch = Math.max(10, String(h).length + 2);
    data.forEach(row => {
      const v = row[h] ?? "";
      wch = Math.min(60, Math.max(wch, String(v).length + 2));
    });
    return { wch };
  });

  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // ✅ مرّر cellStyles
  XLSX.writeFile(wb, fileName, { bookType: "xlsx", cellStyles: true });
};

// ===== Excel Export via HTML Table (Guaranteed Styling) =====
window._reportsExportXlsxTable = function(sheetName, fileName, data) {
  if (!window.XLSX) { alert("مكتبة Excel (XLSX) غير محمّلة"); return; }
  if (!data || !data.length) { alert("لا توجد بيانات للتصدير"); return; }

  const table = document.createElement("table");
  table.dir = "rtl";
  table.style.borderCollapse = "collapse";
  table.style.fontFamily = "Arial";
  table.style.fontSize = "14px";

  const headerRgb = "#2F3E4E";

  const thead = document.createElement("thead");
  const trh = document.createElement("tr");
  Object.keys(data[0]).forEach((k, idx) => {
    const th = document.createElement("th");
    th.textContent = k;
    th.style.background = headerRgb;
    th.style.color = "white";
    th.style.fontWeight = "700";
    th.style.padding = "6px";
    th.style.border = "1px solid #CBD5E1";
    th.style.textAlign = "right";
    trh.appendChild(th);
  });
  thead.appendChild(trh);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  data.forEach(row => {
    const tr = document.createElement("tr");
    Object.keys(data[0]).forEach((k, idx) => {
      const td = document.createElement("td");
      td.textContent = row[k] ?? "";
      td.style.padding = "6px";
      td.style.border = "1px solid #CBD5E1";
      td.style.textAlign = "right";

      if (idx === 0) {
        td.style.background = headerRgb;
        td.style.color = "white";
        td.style.fontWeight = "700";
        td.style.textAlign = "center";
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  const wb = XLSX.utils.table_to_book(table, { sheet: sheetName });
  const ws = wb.Sheets[sheetName];
  ws["!view"] = [{ rightToLeft: true }];

  XLSX.writeFile(wb, fileName);
};
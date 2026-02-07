document.addEventListener("DOMContentLoaded", () => {

  const gender = document.getElementById("gender");
  const socialStatus = document.getElementById("socialStatus");

  const wifeContainer = document.getElementById("wifeContainer");
  const wifeName = document.getElementById("wifeName");
  const femaleNoteContainer = document.getElementById("femaleNoteContainer");

  const totalCountInput = document.getElementById("totalCount");
  const childrenContainer = document.getElementById("childrenContainer");

  const diseasesNone = document.getElementById("diseasesNone");
  const diseasesOther = document.getElementById("diseasesOther");
  const otherDiseaseContainer = document.getElementById("otherDiseaseContainer");

  /* =========================
     الزوجة + التسجيل باسم امرأة
  ========================= */

  function updateWifeLogic() {
    const status = socialStatus.value;
    const g = gender.value;

    const hideWifeStatuses = [
      "اعزب",
      "انسة",
      "ارمل",
      "ارملة",
      "معيل_اسرة",
      "معيلة_اسرة"
    ];

    if (hideWifeStatuses.includes(status)) {
      wifeContainer.style.display = "none";
      wifeName.value = "";
      femaleNoteContainer.style.display = "none";
      return;
    }

    if (status === "متزوج" || status === "متزوجة") {
      wifeContainer.style.display = "block";

      if (g === "انثى") {
        femaleNoteContainer.style.display = "block";
      } else {
        femaleNoteContainer.style.display = "none";
      }
    }
  }

  gender.addEventListener("change", updateWifeLogic);
  socialStatus.addEventListener("change", () => {
    updateWifeLogic();
    updateChildrenByTotal();
  });

  /* =========================
     الأمراض
  ========================= */

  diseasesNone.addEventListener("change", () => {
    if (diseasesNone.checked) {
      diseasesOther.checked = false;
      otherDiseaseContainer.style.display = "none";
    }
  });

  diseasesOther.addEventListener("change", () => {
    if (diseasesOther.checked) {
      diseasesNone.checked = false;
      otherDiseaseContainer.style.display = "block";
    } else {
      otherDiseaseContainer.style.display = "none";
    }
  });

  /* =========================
     الأطفال حسب العدد الكلي
  ========================= */

  function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  function renderChildren(count) {
    childrenContainer.innerHTML = "";
    if (count <= 0) return;

    for (let i = 1; i <= count; i++) {
      const div = document.createElement("div");
      div.className = "child-card";

      div.innerHTML = `
        <h4>الطفل ${i}</h4>

        <label>الاسم الكامل</label>
        <input type="text">

        <label>تاريخ الميلاد</label>
        <input type="date" onchange="
          this.parentElement.querySelector('.age').value =
          (${calculateAge.toString()})(this.value)
        ">

        <label>العمر</label>
        <input type="text" class="age" readonly>

        <label>صلة القرابة</label>
        <select>
          <option>ابن</option>
          <option>ابنة</option>
          <option>اخ</option>
          <option>اخت</option>
        </select>
      `;
      childrenContainer.appendChild(div);
    }
  }

  function updateChildrenByTotal() {
    const total = parseInt(totalCountInput.value);
    const status = socialStatus.value;

    if (isNaN(total) || total <= 1) {
      childrenContainer.innerHTML = "";
      return;
    }

    let childrenCount = 0;

    if (status === "متزوج" || status === "متزوجة") {
      childrenCount = total - 2;
    } else if (status === "ارمل" || status === "ارملة" || status.includes("معيل")) {
      childrenCount = total - 1;
    }

    renderChildren(childrenCount);
  }

  totalCountInput.addEventListener("input", updateChildrenByTotal);

  /* =========================
     تهيئة
  ========================= */

  updateWifeLogic();
});
// app.js

const addFamilySection = document.getElementById('add-family-section');
let families = JSON.parse(localStorage.getItem('families') || '[]');

function createFamilyForm() {
  addFamilySection.innerHTML = '';
  
  const form = document.createElement('div');
  form.classList.add('family-entry');

  form.innerHTML = `
    <label>الحالة الاجتماعية</label>
    <select id="socialStatus">
      <option value="متزوج">متزوج/ـة</option>
      <option value="أرمل">أرمل/ـة</option>
      <option value="أعزب">أعزب/آنسة</option>
      <option value="معيل">معيل/ـة أسرة</option>
    </select>

    <label>اسم رب الأسرة رباعي</label>
    <input type="text" id="fatherName">

    <label>رقم هوية رب الأسرة (9 أرقام)</label>
    <input type="number" id="fatherID">

    <label>العمر</label>
    <input type="number" id="fatherAge">

    <div id="wife-section">
      <label>اسم الزوجة رباعي</label>
      <input type="text" id="wifeName">

      <label>رقم هوية الزوجة</label>
      <input type="number" id="wifeID">

      <label>العمر</label>
      <input type="number" id="wifeAge">
    </div>

    <label>عدد الأفراد الكلي</label>
    <input type="number" id="totalMembers" min="1">

    <div id="children-section"></div>

    <label>رقم الجوال (059 أو 056)</label>
    <input type="text" id="phone" placeholder="مثال: 0591234567">

    <label>رقم جوال بديل</label>
    <input type="text" id="altPhone" placeholder="059 أو 056">

    <label>الأمراض المزمنة</label>
    <select id="chronicDiseases" multiple>
      <option value="لا يوجد">لا يوجد</option>
      <option value="سكري">سكري</option>
      <option value="ضغط">ضغط</option>
      <option value="أمراض أخرى">أخرى</option>
    </select>
    <input type="text" id="otherDisease" placeholder="اكتب الأمراض الأخرى" style="display:none;">

    <label>العنوان الأصلي</label>
    <input type="text" id="originalAddress">

    <label>العنوان الحالي</label>
    <input type="text" id="currentAddress">

    <label>ملاحظات عامة</label>
    <textarea id="notes"></textarea>

    <button id="saveFamily">حفظ الأسرة</button>
  `;

  addFamilySection.appendChild(form);

  const socialStatus = document.getElementById('socialStatus');
  const wifeSection = document.getElementById('wife-section');
  const totalMembersInput = document.getElementById('totalMembers');
  const childrenSection = document.getElementById('children-section');
  const chronicDiseases = document.getElementById('chronicDiseases');
  const otherDisease = document.getElementById('otherDisease');

  // إظهار/إخفاء الزوجة حسب الحالة الاجتماعية
  function updateWifeSection() {
    const status = socialStatus.value;
    if(status === 'أرمل' || status === 'أعزب' || status === 'معيل') {
      wifeSection.style.display = 'none';
    } else {
      wifeSection.style.display = 'block';
    }
  }
  socialStatus.addEventListener('change', updateWifeSection);
  updateWifeSection();

  // إظهار أمراض أخرى إذا تم اختيارها
  chronicDiseases.addEventListener('change', () => {
    if([...chronicDiseases.selectedOptions].some(opt => opt.value === 'أمراض أخرى')) {
      otherDisease.style.display = 'block';
    } else {
      otherDisease.style.display = 'none';
    }
  });

  // إنشاء خانات الأطفال بناءً على عدد الأفراد الكلي
  totalMembersInput.addEventListener('input', () => {
    const total = parseInt(totalMembersInput.value);
    const status = socialStatus.value;
    let numChildren = total;

    if(status === 'متزوج') numChildren -= 2;
    else if(status === 'أرمل' || status === 'أعزب') numChildren -=1;
    else if(status === 'معيل') numChildren -=1;

    if(numChildren < 0) numChildren = 0;

    childrenSection.innerHTML = '';
    for(let i=0;i<numChildren;i++){
      const childDiv = document.createElement('div');
      childDiv.innerHTML = `
        <label>اسم الطفل ${i+1}</label>
        <input type="text" class="childName">
        <label>تاريخ الميلاد</label>
        <input type="date" class="childDOB">
        <label>العمر</label>
        <input type="number" class="childAge" readonly>
        <label>النوع</label>
        <select class="childGender">
          <option value="ذكر">ذكر</option>
          <option value="أنثى">أنثى</option>
        </select>
        <label>صلة القرابة</label>
        <select class="childRelation">
          <option value="ابن">ابن</option>
          <option value="ابنة">ابنة</option>
          <option value="أخ">أخ</option>
          <option value="أخت">أخت</option>
        </select>
      `;
      childrenSection.appendChild(childDiv);
    }

    // حساب العمر تلقائيا عند اختيار تاريخ الميلاد
    const dobInputs = childrenSection.querySelectorAll('.childDOB');
    dobInputs.forEach((dobInput, idx) => {
      dobInput.addEventListener('change', () => {
        const dob = new Date(dobInput.value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if(m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        childrenSection.querySelectorAll('.childAge')[idx].value = age;
      });
    });
  });

  // حفظ الأسرة
  const saveBtn = document.getElementById('saveFamily');
  saveBtn.addEventListener('click', () => {
    const family = {
      socialStatus: socialStatus.value,
      fatherName: document.getElementById('fatherName').value,
      fatherID: document.getElementById('fatherID').value,
      fatherAge: document.getElementById('fatherAge').value,
      wifeName: document.getElementById('wifeName').value,
      wifeID: document.getElementById('wifeID').value,
      wifeAge: document.getElementById('wifeAge').value,
      totalMembers: document.getElementById('totalMembers').value,
      phone: document.getElementById('phone').value,
      altPhone: document.getElementById('altPhone').value,
      diseases: [...chronicDiseases.selectedOptions].map(o=>o.value).join(', '),
      otherDisease: otherDisease.value,
      originalAddress: document.getElementById('originalAddress').value,
      currentAddress: document.getElementById('currentAddress').value,
      notes: document.getElementById('notes').value,
      children: []
    };

    const childNames = childrenSection.querySelectorAll('.childName');
    const childDOBs = childrenSection.querySelectorAll('.childDOB');
    const childAges = childrenSection.querySelectorAll('.childAge');
    const childGenders = childrenSection.querySelectorAll('.childGender');
    const childRelations = childrenSection.querySelectorAll('.childRelation');

    for(let i=0;i<childNames.length;i++){
      family.children.push({
        name: childNames[i].value,
        dob: childDOBs[i].value,
        age: childAges[i].value,
        gender: childGenders[i].value,
        relation: childRelations[i].value
      });
    }

    families.push(family);
    localStorage.setItem('families', JSON.stringify(families));
    alert('تم حفظ الأسرة بنجاح');
    createFamilyForm(); // إعادة النموذج
  });
}

createFamilyForm();
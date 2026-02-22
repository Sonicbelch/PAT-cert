const resultsBody = document.getElementById('resultsBody');
const addRowBtn = document.getElementById('addRowBtn');
const printBtn = document.getElementById('printBtn');
const newDescriptionInput = document.getElementById('newDescription');
const applianceList = document.getElementById('applianceList');

const totalItemsEl = document.getElementById('totalItems');
const totalPassEl = document.getElementById('totalPass');
const totalFailEl = document.getElementById('totalFail');
const passRateEl = document.getElementById('passRate');
const inspectionDateEl = document.querySelector('input[name="inspectionDate"]');
const nextInspectionDateEl = document.querySelector('input[name="nextInspectionDate"]');
const certNoInput = document.querySelector('#certNo') || document.querySelector('input[name="certificateNo"]');

const applianceSuggestions = [
  'Air Conditioner', 'Air Fryer', 'Angle Grinder', 'Battery Charger', 'Blender', 'Boiler', 'Cable Reel',
  'Ceiling Fan', 'Circular Saw', 'Coffee Machine', 'Compressor', 'Computer Tower', 'Dehumidifier',
  'Desk Fan', 'Desktop Monitor', 'Dishwasher', 'Drill', 'Electric Heater', 'Extension Lead',
  'Extractor Fan', 'Floor Lamp', 'Freezer', 'Fridge', 'Hair Dryer', 'Hand Dryer', 'Hedge Trimmer',
  'Hot Plate', 'Immersion Heater', 'Iron', 'Kettle', 'Laptop', 'Leaf Blower', 'Microwave', 'Mixer',
  'Phone Charger', 'Photocopier', 'Plasma Cutter', 'Power Supply', 'Printer', 'Projector',
  'Rice Cooker', 'Sanders', 'Soldering Station', 'Space Heater', 'Table Saw', 'Television', 'Toaster',
  'Tumble Dryer', 'Vacuum Cleaner', 'Washing Machine', 'Water Cooler', 'Water Pump', 'Welder',
  'Work Light', 'Router', 'Server Rack', 'Stereo Amplifier', 'Subwoofer', 'Steam Cleaner'
];

const applianceClassMap = {
  'air conditioner': 'I',
  'air fryer': 'I',
  'angle grinder': 'I',
  'battery charger': 'I',
  'blender': 'I',
  'boiler': 'I',
  'cable reel': 'I',
  'ceiling fan': 'I',
  'circular saw': 'I',
  'coffee machine': 'I',
  'compressor': 'I',
  'computer tower': 'I',
  'dehumidifier': 'I',
  'desk fan': 'I',
  'desktop monitor': 'I',
  'dishwasher': 'I',
  'drill': 'II',
  'electric heater': 'I',
  'extension lead': 'I',
  'extractor fan': 'I',
  'floor lamp': 'II',
  'freezer': 'I',
  'fridge': 'I',
  'hair dryer': 'II',
  'hand dryer': 'I',
  'hedge trimmer': 'II',
  'hot plate': 'I',
  'immersion heater': 'I',
  'iron': 'I',
  'kettle': 'I',
  'laptop': 'II',
  'leaf blower': 'II',
  'microwave': 'I',
  'mixer': 'II',
  'phone charger': 'II',
  'photocopier': 'I',
  'plasma cutter': 'I',
  'power supply': 'II',
  'printer': 'I',
  'projector': 'I',
  'rice cooker': 'I',
  'sanders': 'II',
  'soldering station': 'I',
  'space heater': 'I',
  'table saw': 'I',
  'television': 'II',
  'toaster': 'I',
  'tumble dryer': 'I',
  'vacuum cleaner': 'II',
  'washing machine': 'I',
  'water cooler': 'I',
  'water pump': 'I',
  'welder': 'I',
  'work light': 'II',
  'router': 'II',
  'server rack': 'I',
  'stereo amplifier': 'I',
  'subwoofer': 'I',
  'steam cleaner': 'I'
};

const defaultRows = [
  {
    assetId: 'FRI-001',
    appliance: 'Fridge',
    location: '',
    classType: 'I',
    visual: 'Pass',
    earth: '0.07',
    insulation: '>299',
    polarity: 'Pass',
    result: 'Pass'
  },
  {
    assetId: 'WAS-002',
    appliance: 'Washing Machine',
    location: '',
    classType: 'I',
    visual: 'Pass',
    earth: '0.06',
    insulation: '>299',
    polarity: 'Pass',
    result: 'Pass'
  },
  {
    assetId: 'VAC-003',
    appliance: 'Vacuum Cleaner',
    location: '',
    classType: 'II',
    visual: 'Pass',
    earth: 'N/A',
    insulation: '>299',
    polarity: 'Pass',
    result: 'Pass'
  }
];

function selectOptions(options, selectedValue) {
  return options
    .map((option) => `<option value="${option}" ${option === selectedValue ? 'selected' : ''}>${option}</option>`)
    .join('');
}

function generateEarthContinuityValue() {
  const min = 0.02;
  const max = 1.2;
  const value = Math.random() * (max - min) + min;
  return value.toFixed(2);
}

function makeRow(data = {}) {
  const classType = data.classType || 'I';
  const earthValue = data.earth || (classType === 'II' ? 'N/A' : generateEarthContinuityValue());
  const insulationValue = data.insulation || '>299';

  const row = document.createElement('tr');
  row.innerHTML = `
    <td class="row-number"></td>
    <td><input type="text" name="assetId" value="${data.assetId || ''}" /></td>
    <td><input type="text" name="appliance" value="${data.appliance || ''}" /></td>
    <td><input type="text" name="location" value="${data.location || ''}" /></td>
    <td>
      <select name="classType">
        ${selectOptions(['I', 'II', 'III'], classType)}
      </select>
    </td>
    <td>
      <select name="visual">
        ${selectOptions(['Pass', 'Fail'], data.visual || 'Pass')}
      </select>
    </td>
    <td><input type="text" name="earth" inputmode="decimal" value="${earthValue}" /></td>
    <td><input type="text" name="insulation" value="${insulationValue}" /></td>
    <td>
      <select name="polarity">
        ${selectOptions(['Pass', 'Fail', 'N/A'], data.polarity || 'Pass')}
      </select>
    </td>
    <td>
      <select name="result" class="result-select">
        ${selectOptions(['Pass', 'Fail'], data.result || 'Pass')}
      </select>
    </td>
    <td>
      <button type="button" class="btn delete" aria-label="Delete row">Delete</button>
    </td>
  `;

  row.querySelector('.delete').addEventListener('click', () => {
    row.remove();
    renumberRows();
    updateTotals();
  });

  row.querySelector('.result-select').addEventListener('change', () => {
    paintResult(row);
    updateTotals();
  });

  row.querySelector('select[name="classType"]').addEventListener('change', () => {
    syncClassTypeState(row);
  });

  syncClassTypeState(row);
  paintResult(row);
  return row;
}

function syncClassTypeState(row) {
  const classType = row.querySelector('select[name="classType"]').value;
  const earthInput = row.querySelector('input[name="earth"]');

  if (classType === 'II') {
    if (!earthInput.disabled && earthInput.value && earthInput.value !== 'N/A') {
      earthInput.dataset.previousValue = earthInput.value;
    }
    earthInput.value = 'N/A';
    earthInput.disabled = true;
  } else {
    earthInput.disabled = false;
    earthInput.value = earthInput.dataset.previousValue || earthInput.value || generateEarthContinuityValue();
  }
}

function formatUkDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function setDefaultDates() {
  const today = new Date();
  const nextInspection = new Date(today);
  nextInspection.setFullYear(today.getFullYear() + 3);

  if (inspectionDateEl && !inspectionDateEl.value) {
    inspectionDateEl.value = formatUkDate(today);
  }

  if (nextInspectionDateEl && !nextInspectionDateEl.value) {
    nextInspectionDateEl.value = formatUkDate(nextInspection);
  }
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function generateCertNo() {
  const now = new Date();
  const datePart = `${now.getFullYear()}${pad2(now.getMonth() + 1)}${pad2(now.getDate())}`;
  const timePart = `${pad2(now.getHours())}${pad2(now.getMinutes())}${pad2(now.getSeconds())}`;
  return `EOCPAT-${datePart}-${timePart}`;
}

function setAutoCertificateNo() {
  if (certNoInput && !certNoInput.value.trim()) {
    certNoInput.value = generateCertNo();
  }
}

function paintResult(row) {
  const result = row.querySelector('.result-select').value;
  row.classList.remove('result-pass', 'result-fail');
  row.classList.add(result === 'Pass' ? 'result-pass' : 'result-fail');
}

function renumberRows() {
  [...resultsBody.rows].forEach((row, index) => {
    row.querySelector('.row-number').textContent = String(index + 1);
  });
}

function updateTotals() {
  const rows = [...resultsBody.rows];
  const totalItems = rows.length;
  const totalPass = rows.filter((row) => row.querySelector('.result-select').value === 'Pass').length;
  const totalFail = totalItems - totalPass;
  const passRate = totalItems === 0 ? 0 : Math.round((totalPass / totalItems) * 100);

  totalItemsEl.textContent = String(totalItems);
  totalPassEl.textContent = String(totalPass);
  totalFailEl.textContent = String(totalFail);
  passRateEl.textContent = `${passRate}%`;
}

function addRow(data = {}) {
  const row = makeRow(data);
  resultsBody.appendChild(row);
  renumberRows();
  updateTotals();
}

function populateApplianceSuggestions() {
  if (!applianceList) {
    return;
  }

  applianceSuggestions.forEach((appliance) => {
    const option = document.createElement('option');
    option.value = appliance;
    applianceList.appendChild(option);
  });
}

function getClassForAppliance(description) {
  const applianceName = description.trim().toLowerCase();
  return applianceClassMap[applianceName] || 'I';
}

function addRowFromDescriptionInput() {
  if (!newDescriptionInput) {
    return;
  }

  const applianceDescription = newDescriptionInput.value.trim();
  if (!applianceDescription) {
    return;
  }

  addRow({ appliance: applianceDescription, classType: getClassForAppliance(applianceDescription) });
  newDescriptionInput.value = '';
  newDescriptionInput.focus();
}

defaultRows.forEach((row) => addRow(row));
populateApplianceSuggestions();
setDefaultDates();
setAutoCertificateNo();

addRowBtn.addEventListener('click', () => addRow());
printBtn.addEventListener('click', () => window.print());

if (newDescriptionInput) {
  newDescriptionInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addRowFromDescriptionInput();
    }
  });
}

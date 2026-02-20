const resultsBody = document.getElementById('resultsBody');
const totalItemsEl = document.getElementById('totalItems');
const totalFailedEl = document.getElementById('totalFailed');

const certNo = document.getElementById('certNo');
const dateOfTest = document.getElementById('dateOfTest');
const dateOfRetest = document.getElementById('dateOfRetest');
const inspectorName = document.getElementById('inspectorName');
const signatureText = document.getElementById('signatureText');
const companyLogo = document.getElementById('companyLogo');
const logoFallback = document.getElementById('logoFallback');
const footerLine = document.getElementById('footerLine');
const footerLinePrint = document.getElementById('footerLinePrint');

const earthThresholdEl = document.getElementById('earthThreshold');
const insulationThresholdEl = document.getElementById('insulationThreshold');
const classMappingEl = document.getElementById('classMapping');

const formatDate = (d) => {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const timestampCert = () => {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}${String(d.getSeconds()).padStart(2, '0')}`;
};

const parseMapping = () => classMappingEl.value
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const [keyword, mappedClass] = line.split('=').map((part) => part.trim());
    return { keyword: (keyword || '').toLowerCase(), mappedClass: mappedClass || '' };
  })
  .filter((entry) => entry.keyword && ['I', 'II'].includes(entry.mappedClass.toUpperCase()));

const suggestClass = (description) => {
  const clean = description.toLowerCase();
  const map = parseMapping();
  const match = map.find((entry) => clean.includes(entry.keyword));
  return match ? match.mappedClass.toUpperCase() : '';
};

const evaluateRow = (row) => {
  const visualOnly = row.querySelector('.visual-only').checked;
  const classType = row.querySelector('.class-type').value;
  const continuity = row.querySelector('.continuity').value;
  const insulation = row.querySelector('.insulation').value;
  const description = row.querySelector('.description').value.trim();

  const earthThreshold = Number(earthThresholdEl.value || 0.1);
  const insulationThreshold = Number(insulationThresholdEl.value || 1.0);

  const passCell = row.querySelector('.pass-cell');
  passCell.classList.remove('pass-ok', 'pass-fail', 'pass-visual');

  if (!description) {
    passCell.textContent = '';
    return false;
  }

  if (visualOnly) {
    passCell.textContent = 'VISUAL ONLY';
    passCell.classList.add('pass-visual');
    return true;
  }

  let passed = true;

  if (classType === 'I') {
    if (continuity === '' || Number(continuity) > earthThreshold) {
      passed = false;
    }
  }

  if (insulation === '' || Number(insulation) < insulationThreshold) {
    passed = false;
  }

  passCell.textContent = passed ? 'PASS' : 'FAIL';
  passCell.classList.add(passed ? 'pass-ok' : 'pass-fail');
  return passed;
};

const updateTotals = () => {
  const rows = Array.from(resultsBody.querySelectorAll('tr'));
  const tested = rows.filter((row) => row.querySelector('.description').value.trim()).length;
  const failed = rows.filter((row) => {
    const label = row.querySelector('.pass-cell').textContent;
    return label === 'FAIL';
  }).length;

  totalItemsEl.textContent = String(tested);
  totalFailedEl.textContent = String(failed);
};

const onRowInput = (event) => {
  const row = event.target.closest('tr');
  if (!row) return;

  if (event.target.classList.contains('description')) {
    const classField = row.querySelector('.class-type');
    if (!classField.dataset.manuallySet) {
      classField.value = suggestClass(event.target.value);
    }
  }

  if (event.target.classList.contains('class-type')) {
    event.target.dataset.manuallySet = '1';
  }

  evaluateRow(row);
  updateTotals();
};

const createCellInput = (className, type = 'text', attrs = '') =>
  `<input class="${className}" type="${type}" ${attrs} />`;

const addRow = () => {
  const rowNum = resultsBody.children.length + 1;
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${createCellInput('appliance-no', 'number', `value="${rowNum}" min="1"`)}</td>
    <td>${createCellInput('description', 'text', 'required')}</td>
    <td>${createCellInput('test-date', 'text', `value="${dateOfTest.value}"`)}</td>
    <td>${createCellInput('serial', 'text')}</td>
    <td>
      <select class="class-type">
        <option value=""></option>
        <option value="I">I</option>
        <option value="II">II</option>
      </select>
    </td>
    <td>${createCellInput('fuse-size')}</td>
    <td><input class="visual-only" type="checkbox" /></td>
    <td>${createCellInput('continuity', 'number', 'step="0.01" min="0"')}</td>
    <td>${createCellInput('polarity')}</td>
    <td>${createCellInput('insulation', 'number', 'step="0.1" min="0"')}</td>
    <td>${createCellInput('load', 'number', 'step="0.01" min="0"')}</td>
    <td>${createCellInput('function-run')}</td>
    <td>${createCellInput('earth-leak', 'number', 'step="0.01" min="0"')}</td>
    <td>${createCellInput('rcd-check')}</td>
    <td>${createCellInput('repair-code')}</td>
    <td class="pass-cell"></td>
    <td>${createCellInput('location')}</td>
  `;

  row.addEventListener('input', onRowInput);
  row.addEventListener('change', onRowInput);
  resultsBody.appendChild(row);
  evaluateRow(row);
  updateTotals();
};

const initDates = () => {
  const now = new Date();
  const retest = new Date(now);
  retest.setFullYear(retest.getFullYear() + 3);

  dateOfTest.value = formatDate(now);
  dateOfRetest.value = formatDate(retest);
};

companyLogo.addEventListener('error', () => {
  companyLogo.style.display = 'none';
  logoFallback.style.display = 'flex';
});

inspectorName.addEventListener('input', () => {
  signatureText.textContent = inspectorName.value || ' '; 
});

footerLine.addEventListener('input', () => {
  footerLinePrint.textContent = footerLine.value.trim();
});

earthThresholdEl.addEventListener('input', () => {
  resultsBody.querySelectorAll('tr').forEach((row) => evaluateRow(row));
  updateTotals();
});

insulationThresholdEl.addEventListener('input', () => {
  resultsBody.querySelectorAll('tr').forEach((row) => evaluateRow(row));
  updateTotals();
});

classMappingEl.addEventListener('input', () => {
  resultsBody.querySelectorAll('tr').forEach((row) => {
    const description = row.querySelector('.description').value;
    const classField = row.querySelector('.class-type');
    if (description && !classField.dataset.manuallySet) {
      classField.value = suggestClass(description);
    }
    evaluateRow(row);
  });
  updateTotals();
});

document.getElementById('addRowBtn').addEventListener('click', addRow);
document.getElementById('printBtn').addEventListener('click', () => window.print());

certNo.value = timestampCert();
initDates();
addRow();

// --- TAB SWITCHING & RESET LOGIC ---
function openCalc(evt, calcName) {
    var i, tabcontent, tablinks;

    // 1. Hide all tab contents
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // 2. Remove "active" class from tabs
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // 3. Show current tab and set active
    document.getElementById(calcName).style.display = "block";
    if(evt) evt.currentTarget.className += " active";

    // 4. RESET FEATURE: Clear old inputs and results
    const allInputs = document.querySelectorAll('input');
    allInputs.forEach(input => input.value = '');

    const allResults = document.querySelectorAll('.result-box');
    allResults.forEach(res => res.style.display = 'none');

    const chartWrapper = document.getElementById('emi-chart-wrapper');
    if(chartWrapper) chartWrapper.style.display = 'none';
}

// --- 1. CAPITAL GAINS ---
function calculateCGT() {
    let buy = parseFloat(document.getElementById('cg-buy').value);
    let sell = parseFloat(document.getElementById('cg-sell').value);
    let rate = parseFloat(document.getElementById('cg-rate').value);

    if (!buy || !sell || !rate) return alert("Please fill all fields");

    let profit = sell - buy;
    let tax = profit > 0 ? (profit * (rate / 100)) : 0;

    let resBox = document.getElementById('cg-result');
    resBox.style.display = 'block';
    resBox.innerHTML = `<strong>Profit:</strong> $${profit.toFixed(2)}<br><strong>Tax Payable:</strong> $${tax.toFixed(2)}`;
}

// --- 2. EMI CALCULATOR (With Chart) ---
let myChart = null;

function calculateEMI() {
    let P = parseFloat(document.getElementById('emi-amount').value);
    let r = parseFloat(document.getElementById('emi-rate').value) / 12 / 100;
    let n = parseFloat(document.getElementById('emi-years').value) * 12;

    if (!P || !r || !n) return alert("Please fill all fields");

    let emi = P * r * (Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    let totalPaid = emi * n;
    let totalInterest = totalPaid - P;

    let resBox = document.getElementById('emi-result');
    resBox.style.display = 'block';
    resBox.innerHTML = 
        `<strong>Monthly EMI:</strong> $${emi.toFixed(2)}<br>
         <strong>Total Interest:</strong> $${totalInterest.toFixed(2)}<br>
         <strong>Total Payable:</strong> $${totalPaid.toFixed(2)}`;

    // Draw Chart
    document.getElementById('emi-chart-wrapper').style.display = 'block';
    const ctx = document.getElementById('emiChart').getContext('2d');

    if (myChart) { myChart.destroy(); }

    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Principal', 'Interest'],
            datasets: [{
                data: [P, totalInterest],
                backgroundColor: ['#3498db', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// --- 3. FIXED DEPOSIT ---
function calculateFD() {
    let P = parseFloat(document.getElementById('fd-principal').value);
    let r = parseFloat(document.getElementById('fd-rate').value);
    let t = parseFloat(document.getElementById('fd-time').value);

    if (!P || !r || !t) return alert("Please fill all fields");

    let amount = P * Math.pow((1 + r / 100), t);
    let interest = amount - P;

    let resBox = document.getElementById('fd-result');
    resBox.style.display = 'block';
    resBox.innerHTML = `<strong>Maturity:</strong> $${amount.toFixed(2)}<br><strong>Interest:</strong> $${interest.toFixed(2)}`;
}

// --- 4. REAL ESTATE ---
function calculateRE() {
    let price = parseFloat(document.getElementById('re-price').value);
    let rent = parseFloat(document.getElementById('re-rent').value);
    let appr = parseFloat(document.getElementById('re-appr').value);

    if (!price || !rent || !appr) return alert("Please fill all fields");

    let totalRent = rent * 12 * 5;
    let futureValue = price * Math.pow((1 + appr / 100), 5);
    let totalROI = totalRent + (futureValue - price);

    let resBox = document.getElementById('re-result');
    resBox.style.display = 'block';
    resBox.innerHTML = `<strong>Val (5yr):</strong> $${futureValue.toFixed(2)}<br><strong>Total Return:</strong> $${totalROI.toFixed(2)}`;
}

// --- FIXED PDF DOWNLOAD FUNCTION ---
async function downloadPDF() {
    // 1. Check if library is loaded
    if (!window.jspdf) {
        alert("PDF Library is not loaded. Please check your internet connection.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let title = "";
    let data = [];
    let resultText = "";

    // 2. Safely check which tab is visible
    const isVisible = (id) => document.getElementById(id).style.display === 'block';

    if (isVisible('CapitalGains')) {
        title = "Capital Gains Report";
        data = [
            `Buy Price: $${document.getElementById('cg-buy').value || '0'}`,
            `Sell Price: $${document.getElementById('cg-sell').value || '0'}`,
            `Tax Rate: ${document.getElementById('cg-rate').value || '0'}%`
        ];
        resultText = document.getElementById('cg-result').innerText;
    } 
    else if (isVisible('EMI')) {
        title = "EMI Loan Report";
        data = [
            `Loan Amount: $${document.getElementById('emi-amount').value || '0'}`,
            `Interest Rate: ${document.getElementById('emi-rate').value || '0'}%`,
            `Tenure: ${document.getElementById('emi-years').value || '0'} Years`
        ];
        resultText = document.getElementById('emi-result').innerText;
    } 
    else if (isVisible('FD')) {
        title = "Fixed Deposit Report";
        data = [
            `Principal: $${document.getElementById('fd-principal').value || '0'}`,
            `Interest Rate: ${document.getElementById('fd-rate').value || '0'}%`,
            `Duration: ${document.getElementById('fd-time').value || '0'} Years`
        ];
        resultText = document.getElementById('fd-result').innerText;
    } 
    else if (isVisible('RealEstate')) {
        title = "Real Estate Report";
        data = [
            `Property Price: $${document.getElementById('re-price').value || '0'}`,
            `Monthly Rent: $${document.getElementById('re-rent').value || '0'}`,
            `Appreciation: ${document.getElementById('re-appr').value || '0'}%`
        ];
        resultText = document.getElementById('re-result').innerText;
    }

    // 3. Validate that a calculation has been done
    if (!title || resultText.trim() === "") {
        alert("Please calculate a result before downloading the report.");
        return;
    }

    // 4. Generate PDF
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text(title, 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);

    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(12);
    doc.setTextColor(0);
    let y = 50;
    
    // Add Inputs
    doc.setFont("helvetica", "bold");
    doc.text("Inputs:", 20, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    
    data.forEach(line => {
        doc.text(`• ${line}`, 25, y);
        y += 10;
    });

    y += 10;
    
    // Add Results
    doc.setFont("helvetica", "bold");
    doc.text("Results:", 20, y);
    y += 10;
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 100, 0); // Dark Green
    
    // Clean up result text (remove newlines and format nicely)
    let cleanResult = resultText.replace(/\n/g, "  |  ");
    doc.text(cleanResult, 25, y);

    doc.save("Financial_Report.pdf");
}
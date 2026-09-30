/* =====================================================
   MICROSave
   FRONTEND JAVASCRIPT
===================================================== */

const API = "/api";


/* =====================================================
   GLOBAL DATA
===================================================== */

let allMembers = [];
let allSavings = [];
let allLoans = [];
let allRepayments = [];


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showSection(sectionId, clickedButton = null) {

    document
        .querySelectorAll(".page-section")
        .forEach(section => {
            section.classList.add("hidden");
        });

    const section =
        document.getElementById(sectionId);

    if (!section) {
        return;
    }

    section.classList.remove("hidden");

    document
        .querySelectorAll(".nav-btn")
        .forEach(button => {
            button.classList.remove("active");
        });

    if (clickedButton) {
        clickedButton.classList.add("active");
    }

    if (sectionId === "dashboard") {

        loadDashboard();

    } else if (sectionId === "members") {

        loadMembers();

    } else if (sectionId === "savings") {

        loadSavings();
        loadMembersIntoSavingsDropdown();

    } else if (sectionId === "loans") {

        loadLoans();
        loadMembersIntoLoanDropdown();

    } else if (sectionId === "repayments") {

        loadRepayments();
        loadLoansIntoRepaymentDropdown();

    }
}


/* =====================================================
   SHOW SECTION BY ID
===================================================== */

function showSectionById(sectionId) {

    const button =
        document.querySelector(
            `.nav-btn[onclick*="'${sectionId}'"]`
        );

    showSection(
        sectionId,
        button
    );
}


/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =====================================================
   CURRENCY
===================================================== */

function formatCurrency(value) {

    const number =
        Number(value) || 0;

    return "₹" + number.toFixed(2);
}


/* =====================================================
   DATE HELPERS
===================================================== */

function getTodayDate() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function getDaysDifference(date1, date2) {

    const first =
        new Date(
            `${date1}T00:00:00`
        );

    const second =
        new Date(
            `${date2}T00:00:00`
        );

    const difference =
        second.getTime() -
        first.getTime();

    return Math.ceil(
        difference /
        (1000 * 60 * 60 * 24)
    );
}


/* =====================================================
   LOAN DISPLAY STATUS
===================================================== */

function getLoanDisplayStatus(loan) {

    const outstanding =
        Number(
            loan.outstandingAmount || 0
        );

    /*
     * Fully paid loan
     */
    if (outstanding <= 0) {
        return "PAID";
    }

    /*
     * If there is no payment deadline,
     * use backend status if available.
     */
    if (!loan.paymentDeadline) {

        return (
            loan.status ||
            "PENDING"
        ).toUpperCase();

    }

    const today =
        getTodayDate();

    const deadline =
        loan.paymentDeadline;

    const daysRemaining =
        getDaysDifference(
            today,
            deadline
        );

    /*
     * Deadline already passed
     */
    if (daysRemaining < 0) {
        return "OVERDUE";
    }

    /*
     * Due today or within 7 days
     */
    if (daysRemaining <= 7) {
        return "DUE SOON";
    }

    /*
     * More than 7 days remaining
     */
    return "PENDING";
}


/* =====================================================
   LOAN STATUS CSS CLASS
===================================================== */

function getLoanStatusClass(status) {

    switch (
        String(status)
            .toUpperCase()
        ) {

        case "PAID":
            return "status-paid";

        case "OVERDUE":
            return "status-overdue";

        case "DUE SOON":
            return "status-due-soon";

        case "PENDING":
        default:
            return "status-pending";
    }
}


/* =====================================================
   DASHBOARD
===================================================== */

async function loadDashboard() {

    try {

        const memberResponse =
            await fetch(
                `${API}/members`
            );

        if (!memberResponse.ok) {

            throw new Error(
                "Unable to load members"
            );
        }

        const members =
            await memberResponse.json();

        const memberCount =
            document.getElementById(
                "memberCount"
            );

        if (memberCount) {

            memberCount.textContent =
                members.length;
        }

        displayDashboardMembers(
            members
        );

        await loadDashboardSavings();

        await loadDashboardLoans();
        
        await calculateAvailableBalance();

    }
    catch (error) {

        console.error(
            "Dashboard error:",
            error
        );
    }
}


/* =====================================================
   DASHBOARD MEMBERS
===================================================== */

function displayDashboardMembers(
    members
) {

    const table =
        document.getElementById(
            "dashboardMembers"
        );

    if (!table) {
        return;
    }

    table.innerHTML = "";

    if (
        !members ||
        members.length === 0
    ) {

        table.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="empty-message">
                    No members found
                </td>
            </tr>
        `;

        return;
    }

    members
        .slice(0, 5)
        .forEach(member => {

            table.innerHTML += `
                <tr>

                    <td>
                        ${member.id}
                    </td>

                    <td>
                        ${escapeHtml(
                member.name
            )}
                    </td>

                    <td>
                        ${escapeHtml(
                member.phone
            )}
                    </td>

                    <td>
                        ${escapeHtml(
                member.address
            )}
                    </td>

                    <td>
                        ${
                member.joinDate ||
                "-"
            }
                    </td>

                </tr>
            `;

        });
}


/* =====================================================
   DASHBOARD SAVINGS
===================================================== */

async function loadDashboardSavings() {

    try {

        const response =
            await fetch(
                `${API}/savings`
            );

        if (!response.ok) {
            return;
        }

        const savings =
            await response.json();

        allSavings = savings;

        const total =
            savings.reduce(
                (sum, item) => {

                    return (
                        sum +
                        Number(
                            item.amount || 0
                        )
                    );

                },
                0
            );

        const totalSavings =
            document.getElementById(
                "totalSavings"
            );

        if (totalSavings) {

            totalSavings.textContent =
                formatCurrency(total);
        }

        const table =
            document.getElementById(
                "dashboardSavings"
            );

        if (!table) {
            return;
        }

        table.innerHTML = "";

        if (
            !savings ||
            savings.length === 0
        ) {

            table.innerHTML = `
                <tr>
                    <td
                        colspan="4"
                        class="empty-message">
                        No savings records
                    </td>
                </tr>
            `;

            return;
        }

        savings
            .slice()
            .reverse()
            .slice(0, 5)
            .forEach(item => {

                const memberName =
                    item.member
                        ? item.member.name
                        : "Unknown";

                table.innerHTML += `
                    <tr>

                        <td>
                            ${item.id}
                        </td>

                        <td>
                            ${escapeHtml(
                    memberName
                )}
                        </td>

                        <td>
                            ${formatCurrency(
                    item.amount
                )}
                        </td>

                        <td>
                            ${
                    item.contributionDate ||
                    "-"
                }
                        </td>

                    </tr>
                `;

            });

    }
    catch (error) {

        console.error(
            "Dashboard savings error:",
            error
        );
    }
}


/* =====================================================
   DASHBOARD LOANS
   HTML TABLE = 5 COLUMNS
===================================================== */

async function loadDashboardLoans() {

    try {

        const response =
            await fetch(
                `${API}/loans`
            );

        if (!response.ok) {
            return;
        }

        const loans =
            await response.json();

        allLoans = loans;

        const table =
            document.getElementById(
                "dashboardLoans"
            );

        if (!table) {
            return;
        }

        table.innerHTML = "";

        if (
            !loans ||
            loans.length === 0
        ) {

            table.innerHTML = `
                <tr>
                    <td
                        colspan="5"
                        class="empty-message">
                        No loans found
                    </td>
                </tr>
            `;

            return;
        }

        loans
            .slice()
            .reverse()
            .slice(0, 5)
            .forEach(loan => {

                const memberName =
                    loan.member
                        ? loan.member.name
                        : "Unknown";

                const status =
                    getLoanDisplayStatus(
                        loan
                    );

                const statusClass =
                    getLoanStatusClass(
                        status
                    );

                table.innerHTML += `
                    <tr>

                        <td>
                            ${loan.id}
                        </td>

                        <td>
                            ${escapeHtml(
                    memberName
                )}
                        </td>

                        <td>
                            ${formatCurrency(
                    loan.amount
                )}
                        </td>

                        <td>
                            ${formatCurrency(
                    loan.outstandingAmount
                )}
                        </td>

                        <td>

                            <span
                                class="loan-status ${statusClass}">
                                ${status}
                            </span>

                        </td>

                    </tr>
                `;

            });

    }
    catch (error) {

        console.error(
            "Dashboard loans error:",
            error
        );
    }
}

async function calculateAvailableBalance() {
    try {
        const repRes = await fetch(`${API}/repayments`);
        if (repRes.ok) {
            allRepayments = await repRes.json();
        }
        const totalSav = allSavings.reduce((s, i) => s + Number(i.amount || 0), 0);
        const totalLoan = allLoans.reduce((s, i) => s + Number(i.amount || 0), 0);
        const totalRep = allRepayments.reduce((s, i) => s + Number(i.amount || 0), 0);
        
        const available = totalSav - totalLoan + totalRep;
        const availableBalance = document.getElementById("availableBalance");
        if (availableBalance) {
            availableBalance.textContent = formatCurrency(available);
        }
    } catch(e) {
        console.error("Balance calc error:", e);
    }
}


/* =====================================================
   MEMBERS
===================================================== */

async function loadMembers() {

    try {

        const response =
            await fetch(
                `${API}/members`
            );

        if (!response.ok) {

            throw new Error(
                "Failed to load members"
            );
        }

        allMembers =
            await response.json();

        /*
         * Load savings because
         * member filters depend on
         * total savings.
         */

        try {

            const savingsResponse =
                await fetch(
                    `${API}/savings`
                );

            if (savingsResponse.ok) {

                allSavings =
                    await savingsResponse.json();
            }

        }
        catch (error) {

            console.warn(
                "Unable to load savings for member filters",
                error
            );
        }

        applyMemberFilters();

    }
    catch (error) {

        console.error(
            "Member loading error:",
            error
        );

        const table =
            document.getElementById(
                "memberList"
            );

        if (table) {

            table.innerHTML = `
                <tr>
                    <td
                        colspan="7"
                        class="empty-message">
                        Unable to load members
                    </td>
                </tr>
            `;
        }
    }
}


/* =====================================================
   MEMBER SAVINGS TOTAL
===================================================== */

function getMemberSavingsTotal(
    memberId
) {

    if (
        !Array.isArray(allSavings)
    ) {
        return 0;
    }

    return allSavings.reduce(
        (total, saving) => {

            if (
                saving.member &&
                Number(saving.member.id) ===
                Number(memberId)
            ) {

                return (
                    total +
                    Number(
                        saving.amount || 0
                    )
                );
            }

            return total;

        },
        0
    );
}


/* =====================================================
   MEMBER FILTER + SEARCH + SORT
===================================================== */

function applyMemberFilters() {

    const table =
        document.getElementById(
            "memberList"
        );

    if (!table) {
        return;
    }

    let members =
        Array.isArray(allMembers)
            ? [...allMembers]
            : [];

    /*
     * SEARCH
     */

    const searchInput =
        document.getElementById(
            "memberSearch"
        );

    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";

    if (search) {

        members =
            members.filter(member => {

                const id =
                    String(
                        member.id || ""
                    ).toLowerCase();

                const name =
                    String(
                        member.name || ""
                    ).toLowerCase();

                const phone =
                    String(
                        member.phone || ""
                    ).toLowerCase();

                const address =
                    String(
                        member.address || ""
                    ).toLowerCase();

                return (
                    id.includes(search) ||
                    name.includes(search) ||
                    phone.includes(search) ||
                    address.includes(search)
                );

            });
    }

    /*
     * SAVINGS STATUS FILTER
     */

    const savingsFilter =
        document.getElementById(
            "savingsFilter"
        );

    const filterValue =
        savingsFilter
            ? savingsFilter.value
            : "all";

    if (
        filterValue ===
        "hasSavings"
    ) {

        members =
            members.filter(member => {

                return (
                    getMemberSavingsTotal(
                        member.id
                    ) > 0
                );

            });
    }

    if (
        filterValue ===
        "noSavings"
    ) {

        members =
            members.filter(member => {

                return (
                    getMemberSavingsTotal(
                        member.id
                    ) <= 0
                );

            });
    }

    /*
     * MINIMUM SAVINGS
     */

    const minimumInput =
        document.getElementById(
            "minimumSavings"
        );

    const minimum =
        minimumInput &&
        minimumInput.value !== ""
            ? Number(
                minimumInput.value
            )
            : null;

    if (
        minimum !== null &&
        !Number.isNaN(minimum)
    ) {

        members =
            members.filter(member => {

                return (
                    getMemberSavingsTotal(
                        member.id
                    ) >= minimum
                );

            });
    }

    /*
     * SORT
     */

    const sortInput =
        document.getElementById(
            "memberSort"
        );

    const directionInput =
        document.getElementById(
            "sortDirection"
        );

    const sortBy =
        sortInput
            ? sortInput.value
            : "id";

    const direction =
        directionInput
            ? directionInput.value
            : "asc";

    members.sort(
        (a, b) => {

            let valueA;
            let valueB;

            if (
                sortBy ===
                "name"
            ) {

                valueA =
                    String(
                        a.name || ""
                    ).toLowerCase();

                valueB =
                    String(
                        b.name || ""
                    ).toLowerCase();

            }
            else if (
                sortBy ===
                "joinDate"
            ) {

                valueA =
                    a.joinDate || "";

                valueB =
                    b.joinDate || "";

            }
            else {

                valueA =
                    Number(
                        a.id || 0
                    );

                valueB =
                    Number(
                        b.id || 0
                    );
            }

            if (
                valueA <
                valueB
            ) {

                return direction === "asc"
                    ? -1
                    : 1;
            }

            if (
                valueA >
                valueB
            ) {

                return direction === "asc"
                    ? 1
                    : -1;
            }

            return 0;
        }
    );

    /*
     * DISPLAY
     */

    renderMembers(
        members
    );

    /*
     * RESULT COUNT
     */

    const count =
        document.getElementById(
            "memberResultCount"
        );

    if (count) {

        count.textContent =
            `${members.length} ${
                members.length === 1
                    ? "member"
                    : "members"
            } shown`;
    }
}


/* =====================================================
   RENDER MEMBERS
===================================================== */

function renderMembers(
    members
) {

    const table =
        document.getElementById(
            "memberList"
        );

    if (!table) {
        return;
    }

    table.innerHTML = "";

    if (
        !members ||
        members.length === 0
    ) {

        table.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="empty-message">
                    No members match your search/filter.
                </td>
            </tr>
        `;

        return;
    }

    members.forEach(member => {

        const savings =
            getMemberSavingsTotal(
                member.id
            );

        const savingsClass =
            savings > 0
                ? "savings-positive"
                : "savings-zero";

        table.innerHTML += `
            <tr>

                <td>
                    ${member.id}
                </td>

                <td>
                    ${escapeHtml(
            member.name
        )}
                </td>

                <td>
                    ${escapeHtml(
            member.phone
        )}
                </td>

                <td>
                    ${escapeHtml(
            member.address
        )}
                </td>

                <td>
                    ${
            member.joinDate ||
            "-"
        }
                </td>

                <td>

                    <span
                        class="${savingsClass}">

                        ${formatCurrency(
            savings
        )}

                    </span>

                </td>

                <td>

                    <div class="action-buttons">

                        

                        <button
                            type="button"
                            class="btn-delete"
                            onclick="deleteMember(${member.id})">

                            Delete

                        </button>

                    </div>

                </td>

            </tr>
        `;

    });
}


/* =====================================================
   RESET MEMBER FILTERS
===================================================== */

function resetMemberFilters() {

    const search =
        document.getElementById(
            "memberSearch"
        );

    const sort =
        document.getElementById(
            "memberSort"
        );

    const direction =
        document.getElementById(
            "sortDirection"
        );

    const savingsFilter =
        document.getElementById(
            "savingsFilter"
        );

    const minimum =
        document.getElementById(
            "minimumSavings"
        );

    if (search) {
        search.value = "";
    }

    if (sort) {
        sort.value = "id";
    }

    if (direction) {
        direction.value = "asc";
    }

    if (savingsFilter) {
        savingsFilter.value = "all";
    }

    if (minimum) {
        minimum.value = "";
    }

    applyMemberFilters();
}


/* =====================================================
   ADD MEMBER
===================================================== */

const memberForm =
    document.getElementById(
        "memberForm"
    );

if (memberForm) {

    memberForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            try {

                const member = {

                    name:
                        document
                            .getElementById(
                                "memberName"
                            )
                            .value
                            .trim(),

                    phone:
                        document
                            .getElementById(
                                "memberPhone"
                            )
                            .value
                            .trim(),

                    address:
                        document
                            .getElementById(
                                "memberAddress"
                            )
                            .value
                            .trim(),

                    joinDate:
                    document
                        .getElementById(
                            "joinDate"
                        )
                        .value
                };

                const response =
                    await fetch(
                        `${API}/members`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    member
                                )
                        }
                    );

                if (!response.ok) {

                    const message =
                        await response.text();

                    throw new Error(
                        message ||
                        "Failed to create member"
                    );
                }

                alert(
                    "Member added successfully!"
                );

                this.reset();

                await loadMembers();

                await loadDashboard();

            }
            catch (error) {

                console.error(
                    "Add member error:",
                    error
                );

                alert(
                    "Failed to add member.\n\n" +
                    error.message
                );
            }
        }
    );
}


/* =====================================================
   DELETE MEMBER
===================================================== */

async function deleteMember(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this member?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API}/members/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Delete failed"
            );
        }

        alert(
            "Member deleted successfully!"
        );

        await loadMembers();

        await loadDashboard();

    }
    catch (error) {

        console.error(
            "Delete member error:",
            error
        );

        alert(
            "Unable to delete member.\n\n" +
            error.message
        );
    }
}


/* =====================================================
   LOAD MEMBERS INTO SAVINGS DROPDOWN
===================================================== */

async function loadMembersIntoSavingsDropdown() {

    try {

        const response =
            await fetch(
                `${API}/members`
            );

        if (!response.ok) {
            return;
        }

        const members =
            await response.json();

        const select =
            document.getElementById(
                "savingsMemberId"
            );

        if (!select) {
            return;
        }

        select.innerHTML = `
            <option value="">
                Select Member
            </option>
        `;

        members.forEach(member => {

            select.innerHTML += `
                <option value="${member.id}">
                    ${escapeHtml(
                member.name
            )}
                </option>
            `;

        });

    }
    catch (error) {

        console.error(
            "Savings member dropdown error:",
            error
        );
    }
}


/* =====================================================
   SAVINGS - GET ALL
===================================================== */

async function loadSavings() {

    try {

        const response =
            await fetch(
                `${API}/savings`
            );

        if (!response.ok) {

            throw new Error(
                "Failed to load savings"
            );
        }

        allSavings =
            await response.json();

        const table =
            document.getElementById(
                "savingsList"
            );

        if (!table) {
            return;
        }

        table.innerHTML = "";

        if (
            !allSavings ||
            allSavings.length === 0
        ) {

            table.innerHTML = `
                <tr>
                    <td
                        colspan="5"
                        class="empty-message">
                        No savings records found
                    </td>
                </tr>
            `;

            return;
        }

        allSavings.forEach(item => {

            const memberName =
                item.member
                    ? item.member.name
                    : "Unknown";

            table.innerHTML += `
                <tr>

                    <td>
                        ${item.id}
                    </td>

                    <td>
                        ${escapeHtml(
                memberName
            )}
                    </td>

                    <td>
                        ${formatCurrency(
                item.amount
            )}
                    </td>

                    <td>
                        ${
                item.contributionDate ||
                "-"
            }
                    </td>

                    <td>

                        <div class="action-buttons">



                            <button
                                type="button"
                                class="btn-edit"
                                onclick="editSavings(${item.id})">
                                Edit
                            </button>
                            <button
                                type="button"
                                class="btn-delete"
                                onclick="deleteSavings(${item.id})">

                                Delete

                            </button>

                        </div>

                    </td>

                </tr>
            `;

        });

    }
    catch (error) {

        console.error(
            "Savings loading error:",
            error
        );

        alert(
            "Unable to load savings."
        );
    }
}


/* =====================================================
   ADD SAVINGS
===================================================== */

const savingsForm =
    document.getElementById(
        "savingsForm"
    );

if (savingsForm) {

    savingsForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            try {

                const memberId =
                    document
                        .getElementById(
                            "savingsMemberId"
                        )
                        .value;

                const amount =
                    Number(
                        document
                            .getElementById(
                                "savingsAmount"
                            )
                            .value
                    );

                const contributionDate =
                    document
                        .getElementById(
                            "savingsDate"
                        )
                        .value;

                if (!memberId) {

                    alert(
                        "Please select a member."
                    );

                    return;
                }

                if (
                    amount <= 0 ||
                    Number.isNaN(amount)
                ) {

                    alert(
                        "Please enter a valid savings amount."
                    );

                    return;
                }

                if (!contributionDate) {

                    alert(
                        "Please select a savings date."
                    );

                    return;
                }

                const response =
                    await fetch(
                        `${API}/savings/member/${memberId}`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    amount,

                                    contributionDate

                                })
                        }
                    );

                if (!response.ok) {

                    throw new Error(
                        await response.text()
                    );
                }

                alert(
                    "Savings added successfully!"
                );

                this.reset();

                await loadSavings();

                await loadMembers();

                await loadDashboard();

            }
            catch (error) {

                console.error(
                    "Add savings error:",
                    error
                );

                alert(
                    "Failed to add savings.\n\n" +
                    error.message
                );
            }
        }
    );
}


/* =====================================================
   EDIT SAVINGS
===================================================== */

async function editSavings(id) {
    try {
        const response = await fetch(`${API}/savings/${id}`);
        if (!response.ok) throw new Error("Savings record not found");
        const item = await response.json();
        
        document.getElementById("editSavingsId").value = item.id;
        document.getElementById("editSavingsAmount").value = item.amount || "";
        document.getElementById("editSavingsDate").value = item.contributionDate || "";
        
        const card = document.getElementById("editSavingsCard");
        if (!card) throw new Error("Edit card not found");
        card.classList.remove("hidden");
        card.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error("Edit savings error:", error);
        alert("Unable to open edit form.\n\n" + error.message);
    }
}

function closeEditSavingsCard() {
    const card = document.getElementById("editSavingsCard");
    if (!card) return;
    card.classList.add("hidden");
    const form = document.getElementById("editSavingsForm");
    if (form) form.reset();
}



/* =====================================================
   DELETE SAVINGS
===================================================== */

async function deleteSavings(id) {

    if (
        !confirm(
            "Delete this savings record?"
        )
    ) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API}/savings/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {

            throw new Error(
                await response.text()
            );
        }

        alert(
            "Savings deleted successfully!"
        );

        await loadSavings();

        await loadMembers();

        await loadDashboard();

    }
    catch (error) {

        console.error(
            "Delete savings error:",
            error
        );

        alert(
            "Unable to delete savings.\n\n" +
            error.message
        );
    }
}


/* =====================================================
   LOANS - GET ALL
   HTML TABLE = 7 COLUMNS
===================================================== */

async function loadLoans() {

    try {

        const response =
            await fetch(
                `${API}/loans`
            );

        if (!response.ok) {

            throw new Error(
                "Failed to load loans"
            );
        }

        allLoans =
            await response.json();

        const table =
            document.getElementById(
                "loanList"
            );

        if (!table) {
            return;
        }

        table.innerHTML = "";

        if (
            !allLoans ||
            allLoans.length === 0
        ) {

            table.innerHTML = `
                <tr>
                    <td
                        colspan="7"
                        class="empty-message">
                        No loans found
                    </td>
                </tr>
            `;

            return;
        }

        allLoans.forEach(loan => {

            const memberName =
                loan.member
                    ? loan.member.name
                    : "Unknown";

            const status =
                getLoanDisplayStatus(
                    loan
                );

            const statusClass =
                getLoanStatusClass(
                    status
                );

            table.innerHTML += `
                <tr>

                    <td>
                        ${loan.id}
                    </td>

                    <td>
                        ${escapeHtml(
                memberName
            )}
                    </td>

                    <td>
                        ${formatCurrency(
                loan.amount
            )}
                    </td>

                    <td>
                        ${formatCurrency(
                loan.outstandingAmount
            )}
                    </td>

                    <td>
                        ${
                loan.paymentDeadline ||
                "-"
            }
                    </td>

                    <td>

                        <span
                            class="loan-status ${statusClass}">

                            ${status}

                        </span>

                    </td>

                    <td>

                        <div class="action-buttons">

                            <button
                                type="button"
                                class="btn-view"
                                onclick="viewLoan(${loan.id})">
                                View
                            </button>
                            <button
                                type="button"
                                class="btn-edit"
                                onclick="editLoan(${loan.id})">
                                Edit
                            </button>

                        </div>

                    </td>

                </tr>
            `;

        });

    }
    catch (error) {

        console.error(
            "Loan loading error:",
            error
        );

        alert(
            "Unable to load loans."
        );
    }
}


/* =====================================================
   ADD LOAN
===================================================== */

const loanForm =
    document.getElementById(
        "loanForm"
    );

if (loanForm) {

    loanForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            try {

                const memberId =
                    document
                        .getElementById(
                            "loanMemberId"
                        )
                        .value;

                const amount =
                    Number(
                        document
                            .getElementById(
                                "loanAmount"
                            )
                            .value
                    );

                const loanDate =
                    document
                        .getElementById(
                            "loanDate"
                        )
                        .value;

                const paymentDeadline =
                    document
                        .getElementById(
                            "loanPaymentDeadline"
                        )
                        .value;

                /*
                 * MEMBER VALIDATION
                 */

                if (!memberId) {

                    alert(
                        "Please select a member."
                    );

                    return;
                }

                /*
                 * AMOUNT VALIDATION
                 */

                if (
                    amount <= 0 ||
                    Number.isNaN(amount)
                ) {

                    alert(
                        "Please enter a valid loan amount."
                    );

                    return;
                }

                /*
                 * LOAN DATE
                 */

                if (!loanDate) {

                    alert(
                        "Please select the loan date."
                    );

                    return;
                }

                /*
                 * DEADLINE
                 */

                if (!paymentDeadline) {

                    alert(
                        "Please select the payment deadline."
                    );

                    return;
                }

                /*
                 * DEADLINE CANNOT BE
                 * BEFORE LOAN DATE
                 */

                if (
                    paymentDeadline <
                    loanDate
                ) {

                    alert(
                        "Payment deadline cannot be before the loan date."
                    );

                    return;
                }

                const loan = {

                    amount,

                    loanDate,

                    paymentDeadline

                };

                console.log(
                    "Creating loan:",
                    loan
                );

                const response =
                    await fetch(
                        `${API}/loans/member/${memberId}`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    loan
                                )
                        }
                    );

                if (!response.ok) {

                    throw new Error(
                        await response.text()
                    );
                }

                alert(
                    "Loan created successfully!"
                );

                this.reset();

                await loadLoans();

                await loadDashboard();

                await loadLoansIntoRepaymentDropdown();

            }
            catch (error) {

                console.error(
                    "Add loan error:",
                    error
                );

                alert(
                    "Failed to create loan.\n\n" +
                    error.message
                );
            }
        }
    );
}


/* =====================================================
   LOAD MEMBERS INTO LOAN DROPDOWN
===================================================== */

async function loadMembersIntoLoanDropdown() {

    try {

        const response =
            await fetch(
                `${API}/members`
            );

        if (!response.ok) {
            return;
        }

        const members =
            await response.json();

        const select =
            document.getElementById(
                "loanMemberId"
            );

        if (!select) {
            return;
        }

        select.innerHTML = `
            <option value="">
                Select Member
            </option>
        `;

        members.forEach(member => {

            select.innerHTML += `
                <option value="${member.id}">
                    ${escapeHtml(
                member.name
            )}
                </option>
            `;

        });

    }
    catch (error) {

        console.error(
            "Loan member dropdown error:",
            error
        );
    }
}


/* =====================================================
   VIEW LOAN
===================================================== */

async function viewLoan(id) {

    try {

        const response =
            await fetch(
                `${API}/loans/${id}`
            );

        if (!response.ok) {

            alert(
                "Loan not found."
            );

            return;
        }

        const loan =
            await response.json();

        const memberName =
            loan.member
                ? loan.member.name
                : "Unknown";

        const status =
            getLoanDisplayStatus(
                loan
            );

        alert(

            "Loan Details\n\n" +

            "Loan ID: " +
            loan.id +

            "\nMember: " +
            memberName +

            "\nAmount: " +
            formatCurrency(
                loan.amount
            ) +

            "\nOutstanding: " +
            formatCurrency(
                loan.outstandingAmount
            ) +

            "\nStatus: " +
            status +

            "\nLoan Date: " +
            (
                loan.loanDate ||
                "-"
            ) +

            "\nPayment Deadline: " +
            (
                loan.paymentDeadline ||
                "-"
            )

        );

    }
    catch (error) {

        console.error(
            "View loan error:",
            error
        );

        alert(
            "Unable to load loan."
        );
    }
}


/* =====================================================
   REPAYMENTS - GET ALL
===================================================== */

async function loadRepayments() {

    try {

        const response =
            await fetch(
                `${API}/repayments`
            );

        if (!response.ok) {

            throw new Error(
                "Failed to load repayments"
            );
        }

        allRepayments =
            await response.json();

        const table =
            document.getElementById(
                "repaymentList"
            );

        if (!table) {
            return;
        }

        table.innerHTML = "";

        if (
            !allRepayments ||
            allRepayments.length === 0
        ) {

            table.innerHTML = `
                <tr>
                    <td
                        colspan="5"
                        class="empty-message">
                        No repayments found
                    </td>
                </tr>
            `;

            return;
        }

        allRepayments.forEach(item => {

            const loanId =
                item.loan
                    ? item.loan.id
                    : "-";

            table.innerHTML += `
                <tr>

                    <td>
                        ${item.id}
                    </td>

                    <td>
                        ${loanId}
                    </td>

                    <td>
                        ${formatCurrency(
                item.amount
            )}
                    </td>

                    <td>
                        ${
                item.repaymentDate ||
                "-"
            }
                    </td>

                    <td>

                        <div class="action-buttons">



                            <button
                                type="button"
                                class="btn-edit"
                                onclick="editRepayment(${item.id})">
                                Edit
                            </button>
                            <button
                                type="button"
                                class="btn-delete"
                                onclick="deleteRepayment(${item.id})">

                                Delete

                            </button>

                        </div>

                    </td>

                </tr>
            `;

        });

    }
    catch (error) {

        console.error(
            "Repayment loading error:",
            error
        );

        alert(
            "Unable to load repayments."
        );
    }
}


/* =====================================================
   LOAD LOANS INTO REPAYMENT DROPDOWN
===================================================== */

async function loadLoansIntoRepaymentDropdown() {

    try {

        const response =
            await fetch(
                `${API}/loans`
            );

        if (!response.ok) {
            return;
        }

        const loans =
            await response.json();

        const select =
            document.getElementById(
                "repaymentLoanId"
            );

        if (!select) {
            return;
        }

        select.innerHTML = `
            <option value="">
                Select Loan
            </option>
        `;

        loans.forEach(loan => {

            const memberName =
                loan.member
                    ? loan.member.name
                    : "Unknown";

            const status =
                getLoanDisplayStatus(
                    loan
                );

            select.innerHTML += `
                <option value="${loan.id}">
                    Loan #${loan.id}
                    -
                    ${escapeHtml(
                memberName
            )}
                    -
                    ${status}
                </option>
            `;

        });

    }
    catch (error) {

        console.error(
            "Repayment loan dropdown error:",
            error
        );
    }
}


/* =====================================================
   ADD REPAYMENT
===================================================== */

const repaymentForm =
    document.getElementById(
        "repaymentForm"
    );

if (repaymentForm) {

    repaymentForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            try {

                const loanId =
                    document
                        .getElementById(
                            "repaymentLoanId"
                        )
                        .value;

                const amount =
                    Number(
                        document
                            .getElementById(
                                "repaymentAmount"
                            )
                            .value
                    );

                const repaymentDate =
                    document
                        .getElementById(
                            "repaymentDate"
                        )
                        .value;

                if (!loanId) {

                    alert(
                        "Please select a loan."
                    );

                    return;
                }

                if (
                    amount <= 0 ||
                    Number.isNaN(amount)
                ) {

                    alert(
                        "Please enter a valid repayment amount."
                    );

                    return;
                }

                if (!repaymentDate) {

                    alert(
                        "Please select the repayment date."
                    );

                    return;
                }

                const repayment = {

                    amount,

                    repaymentDate

                };

                const response =
                    await fetch(
                        `${API}/repayments/loan/${loanId}`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    repayment
                                )
                        }
                    );

                if (!response.ok) {

                    throw new Error(
                        await response.text()
                    );
                }

                alert(
                    "Repayment added successfully!"
                );

                this.reset();

                await loadRepayments();

                await loadLoans();

                await loadLoansIntoRepaymentDropdown();

                await loadDashboard();

            }
            catch (error) {

                console.error(
                    "Add repayment error:",
                    error
                );

                alert(
                    "Failed to add repayment.\n\n" +
                    error.message
                );
            }
        }
    );
}


/* =====================================================
   EDIT REPAYMENT
===================================================== */

async function editRepayment(id) {
    try {
        const response = await fetch(`${API}/repayments/${id}`);
        if (!response.ok) throw new Error("Repayment not found");
        const repayment = await response.json();
        
        document.getElementById("editRepaymentId").value = repayment.id;
        document.getElementById("editRepaymentAmount").value = repayment.amount || "";
        document.getElementById("editRepaymentDate").value = repayment.repaymentDate || "";
        
        const card = document.getElementById("editRepaymentCard");
        if (!card) throw new Error("Edit card not found");
        card.classList.remove("hidden");
        card.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error("Edit repayment error:", error);
        alert("Unable to open edit form.\n\n" + error.message);
    }
}

function closeEditRepaymentCard() {
    const card = document.getElementById("editRepaymentCard");
    if (!card) return;
    card.classList.add("hidden");
    const form = document.getElementById("editRepaymentForm");
    if (form) form.reset();
}



/* =====================================================
   DELETE REPAYMENT
===================================================== */

async function deleteRepayment(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this repayment?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API}/repayments/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {

            throw new Error(
                await response.text()
            );
        }

        alert(
            "Repayment deleted successfully!"
        );

        await loadRepayments();

        await loadLoans();

        await loadLoansIntoRepaymentDropdown();

        await loadDashboard();

    }
    catch (error) {

        console.error(
            "Delete repayment error:",
            error
        );

        alert(
            "Unable to delete repayment.\n\n" +
            error.message
        );
    }
}


/* =====================================================
   INITIAL LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadDashboard();

    }
);
async function editLoan(id) {
    try {
        const response = await fetch(`${API}/loans/${id}`);
        if (!response.ok) throw new Error("Loan not found");
        const loan = await response.json();
        
        document.getElementById("editLoanId").value = loan.id;
        document.getElementById("editLoanAmount").value = loan.amount || "";
        document.getElementById("editLoanDate").value = loan.loanDate || "";
        document.getElementById("editLoanPaymentDeadline").value = loan.paymentDeadline || "";
        
        const card = document.getElementById("editLoanCard");
        if (!card) throw new Error("Edit card not found");
        card.classList.remove("hidden");
        card.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error("Edit loan error:", error);
        alert("Unable to open edit form.\n\n" + error.message);
    }
}

function closeEditLoanCard() {
    const card = document.getElementById("editLoanCard");
    if (!card) return;
    card.classList.add("hidden");
    const form = document.getElementById("editLoanForm");
    if (form) form.reset();
}

document.addEventListener("DOMContentLoaded", function() {
    const editSavingsForm = document.getElementById("editSavingsForm");
    if (editSavingsForm) {
        editSavingsForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const id = document.getElementById("editSavingsId").value;
            const amount = Number(document.getElementById("editSavingsAmount").value);
            const contributionDate = document.getElementById("editSavingsDate").value;
            
            try {
                const response = await fetch(`${API}/savings/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount, contributionDate })
                });
                if (!response.ok) throw new Error(await response.text() || "Update failed");
                closeEditSavingsCard();
                alert("Savings updated successfully!");
                await loadSavings();
                await loadMembers();
                await loadDashboard();
            } catch (error) {
                console.error("Update savings error:", error);
                alert("Failed to update savings.\n\n" + error.message);
            }
        });
    }

    const editLoanForm = document.getElementById("editLoanForm");
    if (editLoanForm) {
        editLoanForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const id = document.getElementById("editLoanId").value;
            const amount = Number(document.getElementById("editLoanAmount").value);
            const loanDate = document.getElementById("editLoanDate").value;
            const paymentDeadline = document.getElementById("editLoanPaymentDeadline").value;
            
            try {
                const response = await fetch(`${API}/loans/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount, loanDate, paymentDeadline })
                });
                if (!response.ok) throw new Error(await response.text() || "Update failed");
                closeEditLoanCard();
                alert("Loan updated successfully!");
                await loadLoans();
                await loadDashboard();
            } catch (error) {
                console.error("Update loan error:", error);
                alert("Failed to update loan.\n\n" + error.message);
            }
        });
    }

    const editRepaymentForm = document.getElementById("editRepaymentForm");
    if (editRepaymentForm) {
        editRepaymentForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const id = document.getElementById("editRepaymentId").value;
            const amount = Number(document.getElementById("editRepaymentAmount").value);
            const repaymentDate = document.getElementById("editRepaymentDate").value;
            
            try {
                const response = await fetch(`${API}/repayments/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount, repaymentDate })
                });
                if (!response.ok) throw new Error(await response.text() || "Update failed");
                closeEditRepaymentCard();
                alert("Repayment updated successfully!");
                await loadRepayments();
                await loadLoans();
                await loadDashboard();
            } catch (error) {
                console.error("Update repayment error:", error);
                alert("Failed to update repayment.\n\n" + error.message);
            }
        });
    }
});

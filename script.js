
const MAT_KHAU = "17072025";

// ==================== PASSWORD ====================

const bieuMauMatKhau = document.getElementById("password-form");
const oNhapMatKhau = document.getElementById("password-input");
const thongBaoLoi = document.getElementById("password-error");
const manHinhMatKhau = document.getElementById("password-screen");
const noiDungSinhNhat = document.getElementById("birthday-content");

// Check the password and reveal the birthday page.
if (bieuMauMatKhau) {
    bieuMauMatKhau.addEventListener("submit", function (event) {
        event.preventDefault();

        if (oNhapMatKhau.value.trim() === MAT_KHAU) {
            manHinhMatKhau.classList.remove("active");
            noiDungSinhNhat.classList.remove("hidden");
            thongBaoLoi.textContent = "";

            hienManHinh("home");
        } else {
            thongBaoLoi.textContent =
                "Mật khẩu chưa đúng, công chúa thử lại nhé!";

            oNhapMatKhau.value = "";
            oNhapMatKhau.focus();
        }
    });
}

// ==================== SCREEN NAVIGATION ====================

function hienManHinh(id) {
    document.querySelectorAll("#birthday-content .screen")
        .forEach(function (manHinh) {
            manHinh.classList.remove("active");
        });

    const manHinhCanMo = document.getElementById(id);

    if (manHinhCanMo) {
        manHinhCanMo.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Connect navigation buttons.
document.querySelectorAll("[data-go]").forEach(function (nut) {
    nut.addEventListener("click", function () {
        hienManHinh(nut.dataset.go);
    });
});

// ==================== MEMORY PHOTOS ====================

const sanKhauAnh = document.getElementById("photo-stage");

const danhSachAnh = sanKhauAnh
    ? Array.from(sanKhauAnh.querySelectorAll(".photo"))
    : [];

let anhDangChon = null;
let dangKeo = false;
let viTriBatDauX = 0;
let viTriBatDauY = 0;
let traiBanDau = 0;
let trenBanDau = 0;

function chonAnh(anh) {
    if (!anh) {
        return;
    }

    danhSachAnh.forEach(function (muc) {
        muc.classList.remove("selected");
    });

    anhDangChon = anh;
    anh.classList.add("selected");
}

// Enable dragging, selecting, zooming and double-clicking.
danhSachAnh.forEach(function (anh) {
    anh.addEventListener("pointerdown", function (event) {
        if (event.target.closest("figcaption")) {
            return;
        }

        if (event.button !== undefined && event.button !== 0) {
            return;
        }

        chonAnh(anh);

        dangKeo = true;
        anh.classList.add("dragging");

        const khung = sanKhauAnh.getBoundingClientRect();
        const viTri = anh.getBoundingClientRect();

        viTriBatDauX = event.clientX;
        viTriBatDauY = event.clientY;

        traiBanDau =
            viTri.left - khung.left + viTri.width / 2;

        trenBanDau =
            viTri.top - khung.top + viTri.height / 2;

        anh.setPointerCapture(event.pointerId);
        event.preventDefault();
    });

    anh.addEventListener("pointermove", function (event) {
        if (!dangKeo || anh !== anhDangChon) {
            return;
        }

        const khung = sanKhauAnh.getBoundingClientRect();

        const traiMoi =
            traiBanDau + event.clientX - viTriBatDauX;

        const trenMoi =
            trenBanDau + event.clientY - viTriBatDauY;

        anh.style.left =
            Math.max(0, Math.min(khung.width, traiMoi)) + "px";

        anh.style.top =
            Math.max(0, Math.min(khung.height, trenMoi)) + "px";
    });

    function ketThucKeo() {
        dangKeo = false;
        anh.classList.remove("dragging");
    }

    anh.addEventListener("pointerup", ketThucKeo);
    anh.addEventListener("pointercancel", ketThucKeo);

    anh.addEventListener("click", function (event) {
        if (!event.target.closest("figcaption")) {
            chonAnh(anh);
        }
    });

    // Double-click a photo to enlarge or restore it.
    anh.addEventListener("dblclick", function (event) {
        if (event.target.closest("figcaption")) {
            return;
        }

        chonAnh(anh);

        const phongTo =
            Number(anh.style.getPropertyValue("--scale") || 1);

        anh.style.setProperty(
            "--scale",
            phongTo > 1.2 ? 1 : 1.5
        );
    });

    // Use the mouse wheel over a photo to zoom.
    anh.addEventListener("wheel", function (event) {
        event.preventDefault();
        chonAnh(anh);

        const hienTai =
            Number(anh.style.getPropertyValue("--scale") || 1);

        const thayDoi = event.deltaY < 0 ? 0.1 : -0.1;

        const tiLeMoi = Math.max(
            0.5,
            Math.min(2.5, hienTai + thayDoi)
        );

        anh.style.setProperty("--scale", tiLeMoi);
    }, { passive: false });
});

// Zoom in the selected photo.
const nutPhongTo = document.getElementById("zoom-in");

if (nutPhongTo) {
    nutPhongTo.addEventListener("click", function () {
        if (!anhDangChon && danhSachAnh.length > 0) {
            chonAnh(danhSachAnh[0]);
        }

        if (!anhDangChon) {
            return;
        }

        const hienTai = Number(
            anhDangChon.style.getPropertyValue("--scale") || 1
        );

        anhDangChon.style.setProperty(
            "--scale",
            Math.min(2.5, hienTai + 0.15)
        );
    });
}

// Zoom out the selected photo.
const nutThuNho = document.getElementById("zoom-out");

if (nutThuNho) {
    nutThuNho.addEventListener("click", function () {
        if (!anhDangChon && danhSachAnh.length > 0) {
            chonAnh(danhSachAnh[0]);
        }

        if (!anhDangChon) {
            return;
        }

        const hienTai = Number(
            anhDangChon.style.getPropertyValue("--scale") || 1
        );

        anhDangChon.style.setProperty(
            "--scale",
            Math.max(0.5, hienTai - 0.15)
        );
    });
}

// Restore the original photo layout.
const nutDatLaiAnh = document.getElementById("reset-photos");

if (nutDatLaiAnh) {
    nutDatLaiAnh.addEventListener("click", function () {
        danhSachAnh.forEach(function (anh) {
            anh.style.removeProperty("left");
            anh.style.removeProperty("top");
            anh.style.removeProperty("--scale");
            anh.classList.remove("selected");
            anh.classList.remove("dragging");
        });

        anhDangChon = null;
        dangKeo = false;
    });
}

// ==================== FLOATING HEARTS ====================

function themTraiTim() {
    const traiTim = document.createElement("span");

    traiTim.textContent = ["💗", "💕", "💖", "♡"][
        Math.floor(Math.random() * 4)
    ];

    traiTim.className = "celebration-heart";
    traiTim.style.left = Math.random() * 90 + "vw";

    traiTim.style.setProperty(
        "--heart-size",
        (18 + Math.random() * 24) + "px"
    );

    document.body.appendChild(traiTim);

    traiTim.addEventListener("animationend", function () {
        traiTim.remove();
    });
}

// Add the floating heart animation style.
const kieuTraiTim = document.createElement("style");

kieuTraiTim.textContent = `
.celebration-heart {
    position: fixed;
    bottom: -40px;
    z-index: 9999;
    font-size: var(--heart-size, 24px);
    pointer-events: none;
    animation: bayLen 4s ease-in forwards;
}

@keyframes bayLen {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
    }
    15% {
        opacity: 1;
    }
    100% {
        transform: translateY(-110vh) rotate(35deg);
        opacity: 0;
    }
}`;

document.head.appendChild(kieuTraiTim);

// ==================== PHOTO HEARTS ====================

// Change these paths to match your actual image files.
const danhSachAnhTraiTim = [
    "images/anh1.jpg",
    "images/anh2.jpg",
    "images/anh3.jpg",
    "images/anh4.jpg",
    "images/anh5.jpg",
    "images/anh6.jpg",
    "images/anh7.jpg",
    "images/anh8.jpg",
    "images/anh9.jpg",
    "images/anh10.jpg",
    "images/anh11.jpg",
    "images/anh12.jpg",
    "images/anh13.jpg",
    "images/anh14.jpg"
];

// Create a heart-shaped photo.
function taoTraiTimAnh(duongDan, viTri) {
    const traiTim = document.createElement("div");
    traiTim.className = "heart-photo";

    const maClip = "clipTraiTim" + viTri;

    traiTim.innerHTML = `
        <svg viewBox="0 0 100 90">
            <defs>
                <clipPath id="${maClip}">
                    <path d="M50 84 C42 75 5 51 5 28
                    C5 1 38 -4 50 20
                    C62 -4 95 1 95 28
                    C95 51 58 75 50 84 Z"/>
                </clipPath>
            </defs>

            <image href="${duongDan}"
                width="100"
                height="90"
                preserveAspectRatio="xMidYMid slice"
                clip-path="url(#${maClip})"/>

            <path d="M50 84 C42 75 5 51 5 28
            C5 1 38 -4 50 20
            C62 -4 95 1 95 28
            C95 51 58 75 50 84 Z"
            fill="none"
            stroke="#ff4f91"
            stroke-width="2.5"/>
        </svg>
    `;

    return traiTim;
}

// Display the photo hearts when the birthday button is clicked.
const nutSinhNhat = document.getElementById("celebrate-button");
const khungAnhTraiTim = document.getElementById("heart-photo-container");

if (nutSinhNhat) {
    nutSinhNhat.addEventListener("click", function () {
        // Create the floating heart celebration.
        for (let i = 0; i < 120; i++) {
            setTimeout(themTraiTim, i * 45);
        }

        // Display the photo hearts if the container exists.
        if (khungAnhTraiTim) {
            khungAnhTraiTim.innerHTML = "";

            danhSachAnhTraiTim.forEach(function (duongDan, viTri) {
                const traiTim = taoTraiTimAnh(duongDan, viTri);

                traiTim.style.animationDelay = (viTri * 0.08) + "s";

                khungAnhTraiTim.appendChild(traiTim);
            });
        }
    });
}

// ==================== TYPING EFFECT ====================

function chuChay(id, tocDo = 50) {
    const phanTu = document.getElementById(id);

    if (!phanTu || phanTu.dataset.daChay === "true") {
        return;
    }

    const noiDung = phanTu.textContent.trim();

    phanTu.textContent = "";
    phanTu.dataset.daChay = "true";

    let i = 0;

    function hienThi() {
        if (i < noiDung.length) {
            phanTu.textContent += noiDung.charAt(i);
            i++;
            setTimeout(hienThi, tocDo);
        }
    }

    hienThi();
}

// Run typing effects after the page loads.
document.addEventListener("DOMContentLoaded", function () {
    chuChay("mongUoc", 50);
    chuChay("loiChuc", 50);
});

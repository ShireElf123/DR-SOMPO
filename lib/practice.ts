/**
 * Single source of truth for every fact published on the site.
 *
 * IMPORTANT — editorial governance
 * --------------------------------
 * Nothing medical, academic or contact-related is invented here. Items the
 * brief marks as "to confirm" carry `verified: false`, and the UI renders them
 * with a visible "to confirm" marker rather than silently presenting them as
 * fact. Clinical claims are descriptive only: no statistics, no outcome
 * guarantees, no treatment promises.
 */

export type VerificationState = "verified" | "pending";

export type Practice = {
  doctorName: string;
  shortName: string;
  title: string;
  entity: string;
  hospital: string;
  addressLines: string[];
  suburb: string;
  city: string;
  phone: string;
  phoneHref: string;
  email: string;
  languages: string[];
  bookingMethods: { label: string; detail: string; state: VerificationState }[];
  whatsappNumber: string | null;
};

export const practice: Practice = {
  doctorName: "Dr CM Ngwey-Sompo",
  shortName: "Dr Somp",
  title: "Specialist Obstetrician & Gynaecologist",
  entity: "Dr CM Ngwey-Sompo Inc.",
  hospital: "Life Roseacres Hospital",
  addressLines: ["Corner of St Joseph and Castor Road", "Primrose, Germiston"],
  suburb: "Primrose",
  city: "Johannesburg",
  phone: "011 842 7651",
  phoneHref: "tel:+27118427651",
  email: "chrisscrcross2013@gmail.com",
  languages: ["English", "French"],
  // WhatsApp is intentionally dormant until the practice confirms a
  // WhatsApp-enabled number. Set `whatsappNumber` to switch the
  // WhatsApp enquiry CTAs on across the whole site.
  whatsappNumber: null,
  bookingMethods: [
    {
      label: "WhatsApp",
      detail: "Send an enquiry message. Available once the practice confirms a WhatsApp-enabled number.",
      state: "pending",
    },
    {
      label: "Telephone",
      detail: "Call the practice during consulting hours to request an appointment.",
      state: "verified",
    },
    {
      label: "Email",
      detail: "Email the practice with a non-clinical appointment request.",
      state: "verified",
    },
  ],
};

export const brand = {
  tagline: "Women's Health. Every Stage. Every Journey.",
  supporting:
    "Compassionate, personalised and evidence-informed obstetric and gynaecological care, supporting women through every stage of life.",
  heroCopy:
    "Your health deserves specialist attention and compassionate care. Dr CM Ngwey-Sompo provides obstetric and gynaecological care with a patient-centred approach, supporting women from adolescence through pregnancy, childbirth, menopause and beyond.",
};

export const ticker = [
  "Now consulting at Life Roseacres Hospital, Primrose",
  "Obstetrics · Gynaecology · Fertility",
  "Special interest in fertility and cervical health",
  "Consultations in English and French",
  "Telephone enquiries: 011 842 7651",
  "MMed (O&G), University of the Witwatersrand",
];

export type Service = {
  id: string;
  group: "Obstetrics" | "Gynaecology" | "Fertility" | "Surgery" | "Diagnostics";
  title: string;
  summary: string;
  items: string[];
  image?: string;
  featured?: boolean;
};

export const serviceGroups: {
  id: string;
  label: string;
  headline: string;
  intro: string;
  services: Service[];
}[] = [
  {
    id: "obstetrics",
    label: "Obstetrics",
    headline: "Care through pregnancy, birth and the fourth trimester.",
    intro:
      "Antenatal assessment, close monitoring and delivery care, planned around your pregnancy, your history and your preferences.",
    services: [
      {
        id: "antenatal",
        group: "Obstetrics",
        title: "Antenatal care",
        summary:
          "Scheduled visits to monitor your health and your baby's growth, with time to ask questions at every stage.",
        items: [
          "Pregnancy monitoring and assessment",
          "Maternal care throughout pregnancy",
          "Discussion of birth preferences",
        ],
        image: "/images/antenatal.jpg",
        featured: true,
      },
      {
        id: "delivery",
        group: "Obstetrics",
        title: "Vaginal & caesarean delivery",
        summary:
          "Delivery care at Life Roseacres Hospital, with the mode of birth planned around clinical need and your preferences.",
        items: ["Vaginal delivery", "Caesarean delivery", "Postnatal review"],
      },
    ],
  },
  {
    id: "gynaecology",
    label: "Gynaecology",
    headline: "Everyday gynaecology, handled with discretion and dignity.",
    intro:
      "From routine consultations to screening and assessment, care is unhurried, explained clearly and always on your terms.",
    services: [
      {
        id: "general",
        group: "Gynaecology",
        title: "General gynaecological consultations",
        summary:
          "A confidential space to discuss symptoms, cycles, contraception and any concern about your reproductive health.",
        items: [
          "Contraception counselling",
          "Menstrual and reproductive health assessments",
          "Female health screening",
        ],
        image: "/images/gynae.jpg",
        featured: true,
      },
      {
        id: "oncology",
        group: "Gynaecology",
        title: "Oncology assessment",
        summary:
          "Assessment and appropriate onward referral when a concern requires specialist gynaecological oncology input.",
        items: ["Assessment and investigation", "Cervical screening follow-up", "Referral where indicated"],
      },
    ],
  },
  {
    id: "fertility",
    label: "Fertility",
    headline: "Fertility care that starts with listening.",
    intro:
      "Fertility is one of Dr Somp's special interests. Care begins with a careful assessment and a clear, individualised pathway — with honest expectations at each step.",
    services: [
      {
        id: "fertility-assessment",
        group: "Fertility",
        title: "Fertility assessment & consultation",
        summary:
          "An individualised assessment of your history and circumstances, with a care pathway explained in plain language.",
        items: [
          "Fertility assessment",
          "Fertility-related consultations",
          "Individualised assessment and appropriate care pathways",
        ],
        image: "/images/fertility.jpg",
        featured: true,
      },
    ],
  },
  {
    id: "surgery",
    label: "Minimally invasive & open surgery",
    headline: "Surgical care, planned with precision.",
    intro:
      "Procedures are discussed in full beforehand — what is involved, what the recovery looks like, and what the alternatives are.",
    services: [
      {
        id: "laparoscopy",
        group: "Surgery",
        title: "Laparoscopic & open gynaecological surgery",
        summary:
          "Minimally invasive and open approaches to gynaecological conditions, selected according to clinical need.",
        items: [
          "Ovarian and other gynaecological cysts",
          "Fibroids",
          "Early-stage endometriosis",
          "Hysterectomy",
          "Total laparoscopic hysterectomy",
        ],
        image: "/images/surgery.jpg",
        featured: true,
      },
    ],
  },
];

export const approach = [
  {
    title: "Time to be heard",
    body: "Consultations are unhurried. Your history, your concerns and your context come before any decision about care.",
  },
  {
    title: "Explained in plain language",
    body: "Options, investigations and procedures are described clearly — including what is not yet known — so you can decide with confidence.",
  },
  {
    title: "Evidence-informed",
    body: "Recommendations follow current best practice in obstetrics and gynaecology, adapted to your individual circumstances.",
  },
  {
    title: "Continuity of care",
    body: "From the first consultation through pregnancy, surgery or long-term follow-up, you are cared for by the same specialist.",
  },
];

export const journey = [
  {
    step: "01",
    title: "Book your appointment",
    body: "Contact the practice to enquire about an available consultation. Enquiries are handled by telephone or email; an enquiry is not yet a confirmed appointment.",
    meta: "Telephone · Email · WhatsApp (pending)",
  },
  {
    step: "02",
    title: "Meet Dr Somp",
    body: "Discuss your concerns, medical history and healthcare needs in a private consultation, with time to ask anything you need to.",
    meta: "Consultation · English or French",
  },
  {
    step: "03",
    title: "Your personalised care",
    body: "Receive appropriate clinical assessment, clear recommendations, and a follow-up plan that fits your life.",
    meta: "Assessment · Recommendations · Follow-up",
  },
];

export const credentials = [
  {
    code: "BSc (Biomed)",
    title: "Bachelor of Science in Biomedical Sciences",
    institution: "Undergraduate degree",
    note: "",
  },
  {
    code: "MBChB",
    title: "Bachelor of Medicine and Bachelor of Surgery",
    institution: "Medical degree",
    note: "",
  },
  {
    code: "FCOG (SA)",
    title: "Fellowship of the College of Obstetricians and Gynaecologists",
    institution: "Colleges of Medicine of South Africa (CMSA)",
    note: "",
  },
  {
    code: "MMed (O&G)",
    title: "Master of Medicine in Obstetrics and Gynaecology",
    institution: "University of the Witwatersrand",
    note: "Research: margin status after LLETZ in women living with HIV",
  },
];

export const affiliations: { name: string; detail: string; state: VerificationState }[] = [
  { name: "Health Professions Council of South Africa", detail: "HPCSA", state: "verified" },
  { name: "South African Society of Obstetricians and Gynaecologists", detail: "SASOG", state: "verified" },
  { name: "Colleges of Medicine of South Africa", detail: "CMSA", state: "verified" },
  { name: "South African Medical Association", detail: "SAMA", state: "verified" },
  { name: "Fellowship with the Colleges of Medicine of South Africa", detail: "FCOG (SA)", state: "verified" },
  { name: "Life Roseacres Hospital, Germiston", detail: "Hospital association", state: "verified" },
  {
    name: "Dr Phakisa Mokhesi, Sebokeng",
    detail: "Institutional name and nature of affiliation to be confirmed",
    state: "pending",
  },
];

export const research = {
  heading: "Advancing women's health through research and education.",
  title:
    "Margin Status After LLETZ in Women Living with HIV at a South African Teaching Hospital: Post Universal HAART Program Review",
  author: "Christelle Mbangu Ngwey-Sompo",
  degree: "Master of Medicine in Obstetrics and Gynaecology",
  faculty: "Faculty of Health Sciences, School of Clinical Medicine",
  institution: "University of the Witwatersrand, 2025",
  focus:
    "The study examines margin status after LLETZ — a procedure used to remove abnormal cervical cells — in women living with HIV.",
  context: [
    {
      title: "Why cervical health matters",
      body: "Cervical screening detects changes in the cells of the cervix early, when they are most straightforward to assess and manage. Regular screening is one of the most effective things a woman can do for her long-term health.",
    },
    {
      title: "HPV and prevention",
      body: "Most cervical changes are linked to persistent infection with high-risk types of the human papillomavirus (HPV). HPV vaccination and screening together form the backbone of prevention. Dr Somp is passionate about HPV prevention and patient education.",
    },
    {
      title: "Why research in this area matters",
      body: "Women living with HIV face a higher risk of persistent HPV infection and cervical changes, and are an important focus of women's health research in South Africa. Studies of treatment outcomes in this group help inform how care is delivered.",
    },
  ],
  presentations: [
    { label: "SASOG 2025", detail: "South Africa", state: "verified" as VerificationState },
    {
      label: "Presentis Women's Health Conference",
      detail: "Dubai",
      state: "verified" as VerificationState,
    },
    { label: "FIGO 2025", detail: "Poster presentation", state: "verified" as VerificationState },
    {
      label: "International Journal of Gynecology & Obstetrics",
      detail: "Abstract — publication record to be verified before citation",
      state: "pending" as VerificationState,
    },
  ],
  disclaimer:
    "Numerical findings, statistics and clinical interpretations are deliberately not published here. The original abstract and thesis are being verified with the author before any results are presented.",
};

export const biography = [
  "Dr CM Ngwey-Sompo is a specialist Obstetrician and Gynaecologist practising at Life Roseacres Hospital in Primrose, Germiston, where she runs Dr CM Ngwey-Sompo Inc.",
  "She holds a Master of Medicine in Obstetrics and Gynaecology from the University of the Witwatersrand. Her academic research focused on margin status following Large Loop Excision of the Transformation Zone (LLETZ) in women living with HIV.",
  "Her special interests include fertility and cervical health. She is passionate about HPV prevention, patient education and improving women's health through accessible, informed medical care.",
  "Having experienced difficult pregnancies herself, Dr Somp brings a personal understanding and empathy to the women she cares for.",
];

export const biographyAside = {
  title: "Beyond the practice",
  body: "Outside her medical practice she enjoys travelling, exploring nature, sightseeing, good music and good food.",
  languages: "Consults in English and French.",
};

export const faqs = [
  {
    q: "How do I make an appointment?",
    a: "Appointment enquiries are handled by telephone on 011 842 7651 or by email to chrisscrcross2013@gmail.com. WhatsApp enquiry will be offered once the practice confirms a WhatsApp-enabled number. Submitting an enquiry does not constitute a confirmed appointment — the practice will confirm your date and time directly.",
  },
  {
    q: "What should I bring to my first consultation?",
    a: "Please bring your ID or passport, your medical aid card if you have one, a list of current medications, and any previous results, scans or referral letters that are relevant. If you are pregnant, bring any antenatal records you already have.",
  },
  {
    q: "Where does Dr Somp consult?",
    a: "Dr Somp practises at Life Roseacres Hospital, on the corner of St Joseph and Castor Road, Primrose, Germiston, Johannesburg. Please confirm the exact consulting-room and address details with the practice when you book.",
  },
  {
    q: "Does the practice accept medical aid?",
    a: "Please confirm medical aid arrangements, tariffs and any co-payment directly with the practice before your visit. The website does not publish billing details on the practice's behalf.",
  },
  {
    q: "Can I ask clinical questions through the website?",
    a: "No. This website is not a clinical channel. Please do not send symptoms, results or other sensitive medical information through the enquiry form or by email. Clinical questions are best discussed in a consultation, and urgent concerns should be directed to the hospital or your nearest emergency department.",
  },
  {
    q: "In what languages can I be seen?",
    a: "Consultations are available in English and French.",
  },
  {
    q: "Is my enquiry handled confidentially?",
    a: "Yes. Enquiries are received by the practice and handled in line with South African privacy law, including the Protection of Personal Information Act (POPIA). Only the minimum information needed to arrange your appointment is requested.",
  },
];

/**
 * Real routes, not hash anchors — the site is a set of separate pages with its
 * own page transitions, the way a Framer site is built.
 */
export const nav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "Patient info", href: "/patient-info" },
  { label: "Contact", href: "/contact" },
];

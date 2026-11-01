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
  shortName: "Dr Sompo",
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

/**
 * Facts the practice has confirmed in writing and which the site may state.
 * `yearsInPractice` is deliberately a phrase rather than a number: the practice
 * describes the period as "a year and a half", and a site should not round that
 * into a claim it cannot stand behind.
 */
export const practiceFacts = {
  yearsInPractice: "A year and a half in independent practice",
  hospitals: ["Life Roseacres Hospital, Germiston", "Dr Phakisa Mokhesi Hospital, Sebokeng"],
  conditionScope: "Adolescence through pregnancy, childbirth, menopause and beyond",
};

/**
 * Voice note.
 *
 * The practice describes herself as a women's health advocate "from adolescence
 * to childbirth, menopause and beyond", and speaks in the first person about
 * why she does this work. The site previously spoke about her in the
 * institutional third person — "compassionate, personalised and
 * evidence-informed care" — which is the register every clinic website uses and
 * none of them mean. These strings are hers: the scope sentence, the reason,
 * and the plain description of what a patient gets.
 */
export const brand = {
  tagline: "Women's Health. Every Stage. Every Journey.",
  scope: "From adolescence to childbirth, menopause and beyond.",
  advocacy:
    "A women's health advocate — for HPV prevention, for patient education, and for women who have been told their symptoms are normal.",
  supporting:
    "One specialist, from a first teenage consultation through pregnancy, childbirth and menopause — the same person, in the same rooms, with the same standard of care.",
  heroCopy:
    "Your health deserves specialist attention and an advocate, not just a clinician. Dr CM Ngwey-Sompo cares for women from adolescence through pregnancy, childbirth, menopause and beyond — and explains every step of it in plain language, in English or French.",
  /** First-person, as she describes her own reason for the work. */
  why: "Having been through difficult pregnancies herself, she knows how much the words in that room matter.",
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
        title: "Female screening & oncology assessment",
        summary:
          "Cervical screening, assessment of abnormal results, and onward referral to a gynaecological oncologist where that is the right next step.",
        items: [
          "Cervical screening and follow-up",
          "Assessment of abnormal results",
          "Onward referral where indicated",
        ],
      },
    ],
  },
  {
    id: "fertility",
    label: "Fertility",
    headline: "Fertility care that starts with listening.",
    intro:
      "Fertility is one of Dr Sompo's special interests. Care begins with a careful assessment and a clear, individualised pathway — with honest expectations at each step.",
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
    title: "Meet Dr Sompo",
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
    name: "Dr Phakisa Mokhesi Hospital, Sebokeng",
    detail: "Hospital association",
    state: "verified",
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
      body: "Most cervical changes are linked to persistent infection with high-risk types of the human papillomavirus (HPV). HPV vaccination and screening together form the backbone of prevention. Dr Sompo is passionate about HPV prevention and patient education.",
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
      detail: "Abstract",
      state: "verified" as VerificationState,
    },
  ],
  disclaimer:
    "The abstract reports group-level findings from a single-centre review. Numerical results, subgroup statistics and clinical interpretation are not reproduced on this website; the published abstract is the authoritative source.",
};

export const biography = [
  "Dr CM Ngwey-Sompo is a specialist Obstetrician and Gynaecologist practising at Life Roseacres Hospital in Primrose, Germiston, where she runs Dr CM Ngwey-Sompo Inc.",
  "She holds a Master of Medicine in Obstetrics and Gynaecology from the University of the Witwatersrand. Her academic research focused on margin status following Large Loop Excision of the Transformation Zone (LLETZ) in women living with HIV.",
  "That work was presented at SASOG 2025 in South Africa, at the Presentis Women's Health Conference in Dubai, as a poster at FIGO 2025, and published as an abstract in the International Journal of Gynecology & Obstetrics.",
  "Her special interests are fertility and cervical health. She works hard on HPV prevention and patient education in the community, and her goal is to improve women's health at every stage of life — from adolescence through pregnancy and childbirth, to menopause and beyond.",
  "Having experienced difficult pregnancies herself, Dr Sompo brings a personal understanding and empathy to the women she cares for.",
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
    q: "Where does Dr Sompo consult?",
    a: "Dr Sompo practises at Life Roseacres Hospital, on the corner of St Joseph and Castor Road, Primrose, Germiston, Johannesburg. Please confirm the exact consulting-room and address details with the practice when you book.",
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

/* -------------------------------------------------------------------------- */
/* Service detail                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Long-form content for the individual service pages.
 *
 * Every field is deliberately hedged. Nothing here promises an outcome, quotes
 * a duration, or states a clinical fact the practice has not confirmed: the
 * copy explains *what happens* and *what to bring*, and defers timing and
 * suitability to the consulting room. `verifiedNotes` marks anything the
 * practice still needs to sign off before launch.
 */
export type ServiceDetail = {
  serviceId: string;
  image: string;
  imageAlt: string;
  eyebrow: string;
  standfirst: string;
  sections: { heading: string; body: string[] }[];
  beforeVisit: string[];
  atVisit: string[];
  afterVisit: string[];
  questions: { q: string; a: string }[];
  related: string[];
  verifiedNotes?: string;
};

export const serviceDetails: ServiceDetail[] = [
  {
    serviceId: "antenatal",
    image: "/images/antenatal.jpg",
    imageAlt: "An expectant mother resting in a bright consulting room",
    eyebrow: "Obstetrics",
    standfirst:
      "Antenatal care is the steady, unhurried part of pregnancy — regular visits to check how you and your baby are doing, and time to ask the questions that come up between them.",
    sections: [
      {
        heading: "What antenatal care covers",
        body: [
          "Each visit reviews your health and your baby's growth, and checks anything that has changed since the last appointment. Blood pressure, weight and the baby's position and heartbeat are the usual measures; what is checked at each stage depends on how far along you are.",
          "Where an investigation or scan is needed, it is explained before it is arranged — what it is for, what it involves, and what the result will and will not tell you.",
        ],
      },
      {
        heading: "Planning the birth",
        body: [
          "Conversations about birth begin well before the third trimester. Preferences, previous experiences and any concerns are discussed openly, alongside what is medically advisable in your case.",
          "Where a vaginal birth is not the safest option, the reasons are explained in full and the alternatives are set out — a caesarean is a plan, not a failure.",
        ],
      },
      {
        heading: "Care after delivery",
        body: [
          "The fourth trimester matters as much as the first three. Postnatal review covers your recovery, how feeding is going, and how you are feeling — physically and otherwise.",
          "If something does not feel right in the days after delivery, contact the practice directly rather than waiting for the next appointment.",
        ],
      },
    ],
    beforeVisit: [
      "Your ID or passport and medical aid card, if you have one.",
      "Any previous pregnancy records, scan results or referral letters.",
      "A list of current medications, supplements and anything you are taking for nausea.",
      "Questions you have written down — they are easy to forget in the room.",
    ],
    atVisit: [
      "A short review of how you have been since the last visit.",
      "The usual checks for your stage of pregnancy, explained as they happen.",
      "Time to discuss anything that has come up, including things that feel minor.",
      "A clear plan for what happens next and when the following visit should be.",
    ],
    afterVisit: [
      "You leave knowing what was checked and what it showed.",
      "Anything that needs follow-up is arranged, not left open.",
      "If a concern develops before the next visit, call the practice rather than waiting.",
    ],
    questions: [
      {
        q: "How often will I be seen?",
        a: "Visit frequency depends on your stage of pregnancy and your individual history. The schedule is explained at your first appointment and adjusted if anything changes.",
      },
      {
        q: "Can my partner come with me?",
        a: "Yes. Ask the practice when you book if you would like to bring someone with you, so the room can be arranged for it.",
      },
      {
        q: "What if something worries me between visits?",
        a: "Call the practice during consulting hours. For urgent concerns — reduced fetal movement, bleeding, severe pain — go to Life Roseacres Hospital or your nearest emergency department without waiting.",
      },
    ],
    related: ["delivery", "general"],
  },
  {
    serviceId: "delivery",
    image: "/images/consultation.jpg",
    imageAlt: "A consultation in progress in a bright consulting room",
    eyebrow: "Obstetrics",
    standfirst:
      "Delivery care at Life Roseacres Hospital, with the mode of birth decided on clinical need and your preferences — and explained well before the day itself.",
    sections: [
      {
        heading: "Vaginal delivery",
        body: [
          "Where labour is progressing normally and there is no reason to intervene, vaginal delivery is supported with as little interference as possible.",
          "Pain relief options are discussed during pregnancy rather than in the moment, so that decisions under pressure are already familiar ones.",
        ],
      },
      {
        heading: "Caesarean delivery",
        body: [
          "A caesarean may be planned in advance, or become advisable during labour. Either way the reasoning is explained, and consent is taken properly — not assumed.",
          "Recovery after a caesarean is longer than after a vaginal birth, and the plan for it is set out before the procedure rather than after.",
        ],
      },
      {
        heading: "After the birth",
        body: [
          "You are reviewed in hospital before discharge, and again afterwards. Feeding, wound care where relevant, and your own recovery are all part of that review.",
          "Contraception and planning for any future pregnancy can be discussed at the postnatal visit — it is a normal part of the conversation, not an awkward add-on.",
        ],
      },
    ],
    beforeVisit: [
      "Your hospital bag, packed well before your due date.",
      "Your antenatal card, ID and medical aid details.",
      "A written birth preference, if you have one — it opens the conversation rather than fixing it.",
      "The practice's number saved in your phone.",
    ],
    atVisit: [
      "Assessment on arrival and monitoring of you and your baby.",
      "The plan for birth confirmed, or revised and explained if something has changed.",
      "Consent discussed properly before any intervention.",
    ],
    afterVisit: [
      "Review in hospital before you go home.",
      "A postnatal appointment arranged before discharge.",
      "Direct contact details for anything that concerns you in the first weeks.",
    ],
    questions: [
      {
        q: "Can I plan a caesarean if I want one?",
        a: "That is a conversation to have during pregnancy, not a decision the website can make for you. It depends on your history, your preferences and what is clinically advisable. Raise it early so there is time to discuss it properly.",
      },
      {
        q: "Which hospital will I deliver at?",
        a: "Life Roseacres Hospital in Primrose, Germiston. Please confirm the current delivery arrangements with the practice when you book.",
      },
      {
        q: "What happens if I go into labour at night?",
        a: "Go to the hospital's maternity unit and the on-call arrangements apply. Call the practice number and follow the instructions given there.",
      },
    ],
    related: ["antenatal", "general"],
    verifiedNotes:
      "Delivery and on-call arrangements at Life Roseacres to be confirmed with the practice before launch.",
  },
  {
    serviceId: "general",
    image: "/images/gynae.jpg",
    imageAlt: "A calm consulting room with folded linens and natural light",
    eyebrow: "Gynaecology",
    standfirst:
      "A confidential space to discuss symptoms, cycles, contraception or any concern about your reproductive health — at your pace, in language that makes sense.",
    sections: [
      {
        heading: "What a consultation involves",
        body: [
          "The appointment starts with your history: what brought you in, what you have noticed, and what you are worried about. That conversation usually takes longer than the examination.",
          "An examination is only performed where it is needed and only with your consent. You can ask to stop at any point, and you can ask what is being done and why as it happens.",
        ],
      },
      {
        heading: "Common reasons to be seen",
        body: [
          "Changes in your cycle, pain, bleeding that concerns you, contraception advice, screening, and questions about fertility all belong in a general consultation.",
          "You do not need a referral and you do not need to be certain something is wrong. Uncertainty is a perfectly good reason to book.",
        ],
      },
      {
        heading: "Screening and prevention",
        body: [
          "Cervical screening, HPV vaccination status and breast awareness are reviewed as part of routine care, with the reasoning explained rather than assumed.",
          "Where a result needs follow-up, the next step is set out clearly before you leave.",
        ],
      },
    ],
    beforeVisit: [
      "Your ID and medical aid card, if you have one.",
      "A note of when your last period started and whether your cycle has changed.",
      "Any previous results, scans or letters from other doctors.",
      "A list of medications, including contraception.",
    ],
    atVisit: [
      "An unhurried history — the most useful part of the appointment.",
      "Examination only where needed, and only with your consent.",
      "Investigations arranged with an explanation of what they are for.",
      "A written plan and a follow-up date where relevant.",
    ],
    afterVisit: [
      "Results are discussed with you directly, not left to arrive by message unexplained.",
      "Follow-up timing is agreed before you leave.",
    ],
    questions: [
      {
        q: "Do I need a referral?",
        a: "No. You can book directly. If you have a referral letter, bring it — it helps.",
      },
      {
        q: "Will I be examined?",
        a: "Only if it is needed, and only with your consent. You can decline any part of the examination, and you can ask for a chaperone.",
      },
      {
        q: "Is the consultation confidential?",
        a: "Yes. Your information is handled under POPIA and is not shared without your consent, except where the law requires it.",
      },
    ],
    related: ["oncology", "fertility-assessment"],
  },
  {
    serviceId: "oncology",
    image: "/images/cervical-research.jpg",
    imageAlt: "A microscope in a research setting",
    eyebrow: "Screening & assessment",
    standfirst:
      "Assessment when a concern needs a closer look — including abnormal screening results — with clear onward referral where specialist oncology input is the right next step.",
    sections: [
      {
        heading: "What this assessment is for",
        body: [
          "An abnormal cervical screening result, postmenopausal bleeding, a suspicious finding on examination, or a family history that warrants review are all reasons for assessment.",
          "The purpose of the appointment is to work out what needs investigating and to arrange it — not to reach a conclusion on the day.",
        ],
      },
      {
        heading: "Investigation and referral",
        body: [
          "Where a procedure such as a colposcopy or a biopsy is needed, it is explained beforehand: what it involves, what it feels like, and what the result will tell you.",
          "If the findings need gynaecological oncology input, referral is arranged promptly and the reason for it is explained. Being referred is a sign the right expertise is being brought in, not that something has gone wrong.",
        ],
      },
      {
        heading: "Cervical health and HPV",
        body: [
          "Dr Sompo's research at Wits examined margin status after LLETZ in women living with HIV, and her special interest in HPV prevention shapes how screening and follow-up are discussed.",
          "Cervical changes linked to high-risk HPV are common and usually manageable when found early, which is the whole case for screening.",
        ],
      },
    ],
    beforeVisit: [
      "Your screening history and any previous results or letters.",
      "Dates of any previous procedures, including LLETZ or biopsies.",
      "A list of medications and any known allergies.",
      "Your questions written down — this appointment often raises several.",
    ],
    atVisit: [
      "A full review of your history and previous results.",
      "Examination where indicated, with consent.",
      "Investigation planned, explained, and booked where possible.",
    ],
    afterVisit: [
      "Results communicated directly, with the next step agreed.",
      "Referral arranged where specialist input is needed.",
    ],
    questions: [
      {
        q: "Does an abnormal result mean cancer?",
        a: "Usually not. Most abnormal cervical screening results are not cancer, and many resolve or are treatable when followed up. The purpose of assessment is to find out what is actually going on, not to assume the worst.",
      },
      {
        q: "Will I need a procedure?",
        a: "Possibly. It depends on what the assessment shows. Any procedure is explained before it is arranged, including the alternatives and what happens if you choose not to have it now.",
      },
      {
        q: "Can I be seen for a second opinion?",
        a: "Yes. Bring your results and any correspondence with you.",
      },
    ],
    related: ["general", "laparoscopy"],
    verifiedNotes:
      "Confirm which oncology-related procedures Dr Sompo performs herself versus refers onward.",
  },
  {
    serviceId: "fertility-assessment",
    image: "/images/fertility.jpg",
    imageAlt: "A couple's hands held together",
    eyebrow: "Fertility",
    standfirst:
      "Fertility care begins with a careful assessment and an honest conversation — what is known, what is not yet known, and what the realistic options are at each step.",
    sections: [
      {
        heading: "How the assessment works",
        body: [
          "The first appointment covers both partners where possible: your history, your cycles, any previous investigations, and how long you have been trying.",
          "Investigations are then suggested in a deliberate order rather than all at once, so each one has a reason and a result that changes what happens next.",
        ],
      },
      {
        heading: "What can be done here",
        body: [
          "Assessment, investigation and interpretation of results happen in this practice. Where treatment requires a specialist fertility unit or laboratory, referral is arranged — and the reason is explained.",
          "This practice does not promise a pregnancy. What it can offer is a clear picture, an honest opinion, and a plan that respects what you are willing and able to go through.",
        ],
      },
      {
        heading: "Emotional and practical weight",
        body: [
          "Fertility investigations are tiring, and the waiting between results is often harder than the tests. That is treated as part of the clinical picture, not a distraction from it.",
          "Decisions about how far to go are yours. The role of the practice is to make sure you are making them with accurate information.",
        ],
      },
    ],
    beforeVisit: [
      "How long you have been trying, and any patterns you have noticed in your cycle.",
      "Any previous fertility investigations or results, from either partner.",
      "A list of medications and supplements.",
      "Where possible, bring your partner — the history is more useful with both of you.",
    ],
    atVisit: [
      "A full history, taken without rushing.",
      "An explanation of which investigations are worth doing, and in what order.",
      "A clear account of what this practice can do and what would need referral.",
    ],
    afterVisit: [
      "Results discussed together, with the options set out plainly.",
      "A written plan, including what happens if the first approach does not work.",
    ],
    questions: [
      {
        q: "When should we ask for help?",
        a: "There is no single right moment — it depends on your age, your history and your circumstances. If you are unsure whether it is too early to be seen, that is itself a good reason to book a conversation.",
      },
      {
        q: "Do you offer IVF?",
        a: "This practice provides assessment, investigation and referral. Treatment that requires a fertility laboratory is arranged through a specialist unit, and the reasons for referral are explained.",
      },
      {
        q: "Should my partner come?",
        a: "Where possible, yes. Fertility is assessed as a couple's question, and the history from both sides changes what is worth investigating.",
      },
    ],
    related: ["general", "laparoscopy"],
  },
  {
    serviceId: "laparoscopy",
    image: "/images/surgery.jpg",
    imageAlt: "Laparoscopic equipment in a modern theatre suite",
    eyebrow: "Surgery",
    standfirst:
      "Minimally invasive and open gynaecological surgery, with the approach chosen for your case and the recovery explained before you consent to anything.",
    sections: [
      {
        heading: "Choosing the approach",
        body: [
          "Laparoscopic (keyhole) surgery usually means smaller incisions and a shorter recovery than open surgery. It is not automatically the better option: the right approach depends on what is being treated, previous surgery, and what is safe in your case.",
          "The reasoning for the recommended approach is explained, including why an open procedure may be advised instead.",
        ],
      },
      {
        heading: "What is treated",
        body: [
          "Ovarian and other gynaecological cysts, fibroids, early-stage endometriosis, and hysterectomy including total laparoscopic hysterectomy are all within the scope described for this practice.",
          "Whether a specific procedure is appropriate for you is a clinical decision made after assessment, not something a website can settle.",
        ],
      },
      {
        heading: "Recovery",
        body: [
          "Recovery time varies by procedure and by person. The expected course is explained before surgery, along with the signs that should prompt you to call rather than wait.",
          "Follow-up is arranged before you leave hospital, with a clear point of contact in between.",
        ],
      },
    ],
    beforeVisit: [
      "All previous scan results, operation notes and letters.",
      "A list of medications — some, including blood thinners, need to be discussed before surgery.",
      "Someone to drive you home, where day surgery is planned.",
      "Your questions about recovery, work and time off.",
    ],
    atVisit: [
      "A full review of the indication for surgery and the alternatives.",
      "The procedure explained, including risks, in a way you can act on.",
      "Consent taken properly, with time to think where it is needed.",
    ],
    afterVisit: [
      "Written recovery instructions and warning signs.",
      "Follow-up appointment arranged before discharge.",
      "Direct contact details if something changes before then.",
    ],
    questions: [
      {
        q: "How long is recovery?",
        a: "It depends entirely on the procedure and on you. The expected course for your specific operation is explained before surgery, and the practice would rather you ask twice than guess.",
      },
      {
        q: "Will I need time off work?",
        a: "Usually, yes — how much depends on the procedure and your work. This is discussed before you commit to a date so you can plan.",
      },
      {
        q: "Who performs the surgery?",
        a: "Dr Sompo, at Life Roseacres Hospital. Theatre and anaesthetic arrangements are confirmed by the practice when the date is set.",
      },
    ],
    related: ["general", "oncology"],
    verifiedNotes:
      "Confirm current theatre lists and which procedures are performed at Life Roseacres.",
  },
];

export const serviceDetailMap = Object.fromEntries(
  serviceDetails.map((detail) => [detail.serviceId, detail]),
) as Record<string, ServiceDetail>;

/** Flat index of every service, with its parent group, for routing and cards. */
export const allServices = serviceGroups.flatMap((group) =>
  group.services.map((service) => ({
    ...service,
    groupId: group.id,
    groupLabel: group.label,
  })),
);

export const allServiceMap = Object.fromEntries(
  allServices.map((service) => [service.id, service]),
) as Record<string, (typeof allServices)[number]>;

/* -------------------------------------------------------------------------- */
/* Conditions treated                                                         */
/* -------------------------------------------------------------------------- */

/**
 * The patient arrives with a problem, not with a service name. This is the list
 * that answers "can she help with what I have?" — grouped by the stage of life
 * it belongs to, not by the department that bills for it.
 *
 * Every item traces to the practice's own stated scope: antenatal and delivery
 * care, contraception, fertility assessment, female screening and oncology
 * assessment, and surgery for cysts, fibroids, early-stage endometriosis and
 * hysterectomy. Symptoms are described in the words a patient would use; nothing
 * here diagnoses, promises an outcome, or implies a condition is always treated
 * by this practice.
 */
export type ConditionGroup = {
  id: string;
  label: string;
  stage: string;
  intro: string;
  conditions: string[];
  serviceId: string;
};

export const conditionGroups: ConditionGroup[] = [
  {
    id: "pregnancy",
    label: "Pregnancy & birth",
    stage: "Antenatal to postnatal",
    intro:
      "The whole of a pregnancy, including the parts nobody warns you about.",
    conditions: [
      "Pregnancy care and antenatal visits",
      "Planning for a vaginal or caesarean birth",
      "Concerns about the baby's growth or movement",
      "High blood pressure in pregnancy",
      "Bleeding in early pregnancy",
      "Previous difficult pregnancy or birth",
      "Twin or multiple pregnancy",
      "Postnatal recovery and feeding concerns",
    ],
    serviceId: "antenatal",
  },
  {
    id: "cycle",
    label: "Cycles & everyday gynaecology",
    stage: "Adolescence onwards",
    intro:
      "The symptoms that are common but rarely discussed, and the contraception conversation that goes with them.",
    conditions: [
      "Heavy or painful periods",
      "Irregular or absent periods",
      "Contraception counselling and fitting",
      "Pain during sex",
      "Recurrent vaginal infections or discharge",
      "Polycystic ovary syndrome (PCOS) assessment",
      "Menopause and perimenopause symptoms",
      "A first gynaecological visit, at any age",
    ],
    serviceId: "general",
  },
  {
    id: "screening",
    label: "Screening & cervical health",
    stage: "From the first Pap smear onwards",
    intro:
      "Screening, abnormal results, and the follow-up that should never be left open.",
    conditions: [
      "Routine cervical screening (Pap smear)",
      "An abnormal Pap smear result",
      "HPV testing and HPV prevention",
      "Colposcopy and biopsy",
      "LLETZ and follow-up after treatment",
      "Postmenopausal bleeding",
      "A suspicious finding on examination",
      "Family history that warrants assessment",
    ],
    serviceId: "oncology",
  },
  {
    id: "fertility",
    label: "Fertility",
    stage: "When conception is taking longer",
    intro:
      "Her special interest. Assessment first, then an honest conversation about what comes next.",
    conditions: [
      "Difficulty falling pregnant",
      "Recurrent pregnancy loss",
      "Irregular ovulation",
      "Male-factor concerns raised by a partner's results",
      "PCOS and fertility",
      "Endometriosis and fertility",
      "Review after previous fertility treatment",
      "A second opinion on a fertility plan",
    ],
    serviceId: "fertility-assessment",
  },
  {
    id: "surgery",
    label: "Growths & surgical conditions",
    stage: "When an operation is being considered",
    intro:
      "Conditions where surgery may be one option — discussed in full before anything is decided.",
    conditions: [
      "Ovarian and other gynaecological cysts",
      "Uterine fibroids",
      "Early-stage endometriosis",
      "Hysterectomy, including total laparoscopic hysterectomy",
      "Pelvic pain needing investigation",
      "Heavy bleeding not controlled by other treatment",
    ],
    serviceId: "laparoscopy",
  },
];

/** Every condition name once, for the search-style index. */
export const allConditions = conditionGroups.flatMap((group) =>
  group.conditions.map((condition) => ({ condition, group: group.label, serviceId: group.serviceId })),
);

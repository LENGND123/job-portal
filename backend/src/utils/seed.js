import { User } from "../models/User.js";
import { Company } from "../models/Company.js";
import { Job } from "../models/Job.js";
import { Application } from "../models/Application.js";

function makePdf(text) {
  const safe = String(text).replace(/[()\\]/g, "");
  const stream = `BT /F1 18 Tf 48 140 Td (${safe}) Tj ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Count 1 /Kids [3 0 R] >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let body = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(body));
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefStart = Buffer.byteLength(body);
  let xref = `xref\n0 ${objects.length + 1}\n`;
  xref += "0000000000 65535 f \n";
  for (let index = 1; index < offsets.length; index += 1) {
    xref += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  body += xref;
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return body;
}

function logoDataUrl(name, color) {
  const letter = name.trim().charAt(0).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="${color}"/><text x="64" y="64" text-anchor="middle" dominant-baseline="central" font-family="Arial, sans-serif" font-size="64" fill="white" font-weight="700">${letter}</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

const companiesSeed = [
  {
    name: "Northstar",
    description: "Northstar builds hiring tools for growing product teams.",
    website: "https://northstar.example",
    location: "Bangalore",
    color: "#6A38C2",
  },
  {
    name: "Harbor Cloud",
    description: "Harbor Cloud runs scheduling software for clinics.",
    website: "https://harborcloud.example",
    location: "Hyderabad",
    color: "#0F766E",
  },
  {
    name: "Paper & Pixel",
    description: "Paper & Pixel is a studio for brand and campaign design.",
    website: "https://paperandpixel.example",
    location: "Delhi NCR",
    color: "#F83002",
  },
  {
    name: "Lumen Health",
    description: "Lumen Health makes a patient app used by clinics across Maharashtra.",
    website: "https://lumenhealth.example",
    location: "Pune",
    color: "#1D4ED8",
  },
  {
    name: "Fieldnote",
    description: "Fieldnote helps field teams file reports from their phones.",
    website: "https://fieldnote.example",
    location: "Mumbai",
    color: "#B45309",
  },
  {
    name: "Kite Analytics",
    description: "Kite Analytics turns recruiting data into forecasts teams can use.",
    website: "https://kiteanalytics.example",
    location: "Mumbai",
    color: "#7C3AED",
  },
];

const jobsSeed = [
  {
    company: "Northstar",
    title: "Frontend Developer",
    description: "Build the product interface for Northstar's hiring tools. You will ship React screens, tighten accessibility, and work with design on the application flow.",
    requirements: ["React", "JavaScript", "Tailwind", "Accessibility"],
    salary: 18,
    location: "Bangalore",
    jobType: "Full-time",
    experienceLevel: 2,
    position: 4,
    daysAgo: 1,
  },
  {
    company: "Harbor Cloud",
    title: "Backend Developer",
    description: "Design APIs and data models for Harbor Cloud's clinic scheduling service. You will work in Node.js and MongoDB with the team that carries the pager.",
    requirements: ["Node.js", "MongoDB", "REST", "Testing"],
    salary: 8,
    location: "Hyderabad",
    jobType: "Full-time",
    experienceLevel: 1,
    position: 3,
    daysAgo: 2,
  },
  {
    company: "Kite Analytics",
    title: "Data Science",
    description: "Turn hiring data into models the team can trust. You will write analyses, explain the results, and help recruiters decide what to do next.",
    requirements: ["Python", "SQL", "Statistics", "Pandas"],
    salary: 24,
    location: "Mumbai",
    jobType: "Full-time",
    experienceLevel: 3,
    position: 2,
    daysAgo: 4,
  },
  {
    company: "Paper & Pixel",
    title: "Graphic Designer",
    description: "Shape the visual system for Paper & Pixel's campaign work. You will design posters, social sets, and the occasional product page.",
    requirements: ["Figma", "Typography", "Brand systems", "Illustration"],
    salary: 4,
    location: "Delhi NCR",
    jobType: "Full-time",
    experienceLevel: 1,
    position: 2,
    daysAgo: 6,
  },
  {
    company: "Lumen Health",
    title: "FullStack Developer",
    description: "Own features across the Lumen Health app, from the React screen to the API behind it. You will pair with clinicians on the wording patients see.",
    requirements: ["React", "Node.js", "MongoDB", "CSS"],
    salary: 12,
    location: "Pune",
    jobType: "Full-time",
    experienceLevel: 2,
    position: 5,
    daysAgo: 3,
  },
  {
    company: "Fieldnote",
    title: "Frontend Developer",
    description: "A six-month internship for someone who has built a React project and wants a real team. You will fix bugs, ship small UI, and sit in on reviews.",
    requirements: ["React", "HTML", "CSS", "Git"],
    salary: 3,
    location: "Mumbai",
    jobType: "Internship",
    experienceLevel: 0,
    position: 6,
    daysAgo: 0,
  },
  {
    company: "Northstar",
    title: "Backend Developer",
    description: "Work on Northstar's job search API: query speed, auth, and the queues that send application mail. Node.js experience matters more than a specific framework.",
    requirements: ["Node.js", "Express", "MongoDB", "Redis"],
    salary: 22,
    location: "Bangalore",
    jobType: "Full-time",
    experienceLevel: 4,
    position: 2,
    daysAgo: 9,
  },
  {
    company: "Paper & Pixel",
    title: "Graphic Designer",
    description: "Part-time social and presentation work for Paper & Pixel's Hyderabad studio. Two or three days a week, mostly in Figma.",
    requirements: ["Figma", "Social design", "Presentation", "Layout"],
    salary: 6,
    location: "Hyderabad",
    jobType: "Part-time",
    experienceLevel: 2,
    position: 1,
    daysAgo: 12,
  },
];

export async function seedIfEmpty() {
  try {
    if (await User.countDocuments()) {
      console.log("Existing database found. Demo data was not reset.");
      return;
    }
    await seedDemo();
  } catch (error) {
    if (error?.code === 11000) return;
    throw error;
  }
}

async function seedDemo() {
  const resumeName = "Priya-Shah-Resume.pdf";
  const pdf = Buffer.from(makePdf("Priya Shah  |  Frontend developer")).toString("base64");
  const resume = ["data", "application/pdf;base64," + pdf].join(":");

  const recruiter = await User.create({
    fullname: "Rahul Mehta",
    email: "recruiter@jobhunt.dev",
    phoneNumber: "9876543210",
    password: "recruiter123",
    role: "recruiter",
    profile: { bio: "I hire engineers and designers for product teams." },
  });

  const student = await User.create({
    fullname: "Priya Shah",
    email: "student@jobhunt.dev",
    phoneNumber: "9123456780",
    password: "student123",
    role: "student",
    profile: {
      bio: "Final-year computer science student looking for a frontend role.",
      skills: ["React", "JavaScript", "Tailwind", "Node.js"],
      resume,
      resumeOriginalName: resumeName,
    },
  });

  const companies = [];
  for (const item of companiesSeed) {
    const logo = logoDataUrl(item.name, item.color);
    companies.push(
      await Company.create({
        name: item.name,
        description: item.description,
        website: item.website,
        location: item.location,
        logo,
        userId: recruiter._id,
      })
    );
  }

  const jobs = [];
  for (const item of jobsSeed) {
    const company = companies.find((entry) => entry.name === item.company);
    const createdAt = new Date(Date.now() - (item.daysAgo || 0) * 24 * 60 * 60 * 1000);
    const job = await Job.create({
      title: item.title,
      description: item.description,
      requirements: item.requirements,
      salary: item.salary,
      location: item.location,
      jobType: item.jobType,
      experienceLevel: item.experienceLevel,
      position: item.position,
      company: company._id,
      created_by: recruiter._id,
      createdAt,
    });
    await Job.collection.updateOne({ _id: job._id }, { $set: { createdAt } });
    jobs.push(job);
  }

  const application = await Application.create({
    job: jobs[0]._id,
    applicant: student._id,
    status: "pending",
  });
  await Job.updateOne({ _id: jobs[0]._id }, { $push: { applications: application._id } });

  console.log("Seeded demo companies, jobs, and one application.");
  console.log("Student    student@jobhunt.dev    student123");
  console.log("Recruiter  recruiter@jobhunt.dev  recruiter123");
}

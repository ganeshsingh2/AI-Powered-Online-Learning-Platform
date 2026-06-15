// LandingPage.jsx
import Image from "next/image";
import Link from "next/link";
import React from "react";

const courses = [
  {
    title: "Introduction to Generative AI",
    org: "University of Wollongong",
    desc: "Learn the basics of generative AI, prompts, and future career skills.",
    image: "/gai.png",
  },
  {
    title: "AI for Learning and Future Careers",
    org: "Temasek Polytechnic",
    desc: "Explore how AI improves learning and creates new opportunities.",
    image: "/ailf.jpg",
  },
  {
    title: "The Climate Challenge",
    org: "University of Wollongong",
    desc: "Understand climate change, its causes, impacts, and solutions.",
    image: "/cc.png",
  },
  {
    title: "Fundamentals of Artificial Intelligence",
    org: "London Intercultural Academy",
    desc: "Learn core AI concepts, history, applications, and modern tools.",
    image: "/fai.png",
  },
  {
    title: "Big Data and Analytics",
    org: "Temasek Polytechnic",
    desc: "Discover how data analytics helps business decision-making.",
    image: "/bda.png",
  },
  {
    title: "Cybersecurity Applications",
    org: "Temasek Polytechnic",
    desc: "Understand cybersecurity fundamentals and practical protection methods.",
    image: "/cs.png",
  },
];

const SIGN_IN_PATH = "/sign-in";
const SIGN_UP_PATH = "/sign-up";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#ecfeff] text-slate-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-cyan-100 bg-white/85 px-8 py-5 shadow-sm backdrop-blur">
        <h1 className="text-2xl font-bold text-teal-700">OpenLearning</h1>

        <div className="hidden gap-8 md:flex">
          <a href="#solutions" className="text-slate-700 hover:text-teal-700">Our solutions</a>
          <a href="#courses" className="text-slate-700 hover:text-teal-700">Find courses</a>
        </div>

        <div className="flex gap-3">
          <Link href={SIGN_IN_PATH} className="rounded-lg px-4 py-2 text-teal-800 hover:bg-cyan-50">
            Log in
          </Link>
          <Link href={SIGN_UP_PATH} className="rounded-lg bg-orange-500 px-5 py-2 text-white shadow-sm hover:bg-orange-600">
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-50 via-emerald-50 to-orange-50 px-8 py-20 text-center">
        <h2 className="mx-auto max-w-4xl text-5xl font-extrabold leading-tight md:text-6xl">
          The <span className="text-teal-700">AI-powered</span> learning
          platform for <span className="text-orange-500">educators</span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Create, deliver and sell transformative online courses effortlessly.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link href={SIGN_UP_PATH} className="rounded-xl bg-teal-600 px-7 py-3 font-semibold text-white shadow-sm hover:bg-teal-700">
            For education providers
          </Link>
          <Link href={SIGN_UP_PATH} className="rounded-xl border border-orange-300 bg-white px-7 py-3 font-semibold text-orange-600 hover:bg-orange-50">
            For learners
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-teal-700 px-8 py-12 text-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 text-center md:grid-cols-4">
          {[
            ["3M+", "Learners"],
            ["300+", "Public Courses"],
            ["300+", "Institutions"],
            ["4,250+", "Private Courses"],
          ].map(([num, label]) => (
            <div key={label}>
              <h3 className="text-4xl font-bold text-orange-200">{num}</h3>
              <p className="mt-2 text-cyan-50">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Software Section */}
      <section id="solutions" className="grid gap-10 bg-white px-8 py-20 md:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase text-emerald-600">
            For education, training & upskilling
          </p>
          <h2 className="mt-3 text-4xl font-bold">
            Award-winning software trusted by industry-leading institutions
          </h2>
          <p className="mt-5 text-gray-600">
            Discover why organisations worldwide choose OpenLearning to deliver
            their programs online.
          </p>

          <div className="mt-6 flex gap-4">
            <Link href={SIGN_UP_PATH} className="rounded-xl bg-orange-500 px-6 py-3 text-white hover:bg-orange-600">
              Request a demo
            </Link>
            <Link href={SIGN_UP_PATH} className="rounded-xl border border-teal-300 px-6 py-3 text-teal-700 hover:bg-cyan-50">
              Explore stories
            </Link>
          </div>
        </div>

        <div className="grid gap-5">
          {["Short courses", "OpenCreds", "Qualifications"].map((item) => (
            <div key={item} className="rounded-2xl border border-cyan-100 bg-cyan-50 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-teal-800">{item}</h3>
              <p className="mt-3 text-gray-600">
                Flexible online learning programs designed for skill development
                and career growth.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Sections */}
      <section className="bg-gradient-to-r from-emerald-100 via-cyan-100 to-orange-100 px-8 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-bold uppercase text-teal-700">
            Advanced authoring tools
          </p>
          <h2 className="mt-3 text-4xl font-bold text-slate-950">
            Learning design tools for active learning
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-gray-600">
            Enrich your courses with activity-based learning, collaborative
            projects, and community facilitation.
          </p>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="bg-[#f0fdfa] px-8 py-20">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-4xl font-bold text-teal-900">Courses</h2>
          <Link href={SIGN_UP_PATH} className="rounded-xl border border-orange-300 bg-white px-5 py-2 text-orange-600 hover:bg-orange-50">
            View all
          </Link>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.title}
              className="rounded-2xl border border-cyan-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative mb-5 h-36 overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              <p className="text-sm font-semibold text-emerald-600">
                {course.org}
              </p>
              <h3 className="mt-2 text-xl font-bold">{course.title}</h3>
              <p className="mt-3 text-gray-600">{course.desc}</p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-gray-500">On now</span>
                <Link href={SIGN_UP_PATH} className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700">
                  Enrol
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="bg-orange-50 px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-teal-900">Featured partner institutions</h2>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-5 md:grid-cols-4">
          {[
            "UNSW",
            "DeakinCo",
            "Temasek Polytechnic",
            "Western Sydney University",
            "Charles Sturt University",
            "University of Wollongong",
            "Australian Catholic University",
            "OpenLearning",
          ].map((partner) => (
            <div
              key={partner}
              className="rounded-xl border border-orange-100 bg-white p-5 font-semibold text-slate-700 shadow-sm"
            >
              {partner}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-teal-700 via-emerald-600 to-orange-500 px-8 py-20 text-center text-white">
        <h2 className="text-4xl font-bold">
          Join over 3,000,000 learners worldwide
        </h2>
        <Link href={SIGN_UP_PATH} className="mt-8 inline-flex rounded-xl bg-white px-8 py-3 font-semibold text-teal-700 hover:bg-cyan-50">
          Browse our courses
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-teal-950 px-8 py-12 text-white">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-2xl font-bold">OpenLearning</h3>
            <p className="mt-4 text-cyan-100">
              A scalable online learning platform for educators and learners.
            </p>
          </div>

          {["Platform", "Company", "Help & Support"].map((title) => (
            <div key={title}>
              <h4 className="font-bold">{title}</h4>
              <ul className="mt-4 space-y-2 text-cyan-100">
                <li>Features</li>
                <li>Pricing</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-slate-400">
          © 2026 OpenLearning Clone. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

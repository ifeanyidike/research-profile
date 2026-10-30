// Career figures are dated observations/forecasts, not salary or hiring promises.
const sources = {
  definition: "https://www.ncsc.gov.uk/section/about-ncsc/what-is-cyber-security",
  us: "https://www.bls.gov/ooh/computer-and-information-technology/information-security-analysts.htm",
  uk: "https://www.gov.uk/government/publications/cyber-security-skills-in-the-uk-labour-market-2026/cyber-security-skills-in-the-uk-labour-market-2026",
  ukPay: "https://nationalcareers.service.gov.uk/job-profiles/cyber-intelligence-officer",
  aiThreat: "https://www.ncsc.gov.uk/report/impact-ai-cyber-threat-now-2027",
  aiGovernance: "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/",
};
const cite = (key, label) => `<a href="${sources[key]}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
const role = (title, work, fit, lesson, label) =>
  `<article class="career-card"><h3>${title}</h3><p>${work}</p><p class="career-fit"><strong>You might enjoy it if:</strong> ${fit}</p><a href="#lesson/${lesson}/learn">Explore ${label} ↗</a></article>`;

export function introduction() {
  return `<article class="introduction">
    <header class="intro-hero">
      <span class="eyebrow">WHY CYBERSECURITY? · PURPOSE, PEOPLE & POSSIBILITIES</span>
      <h1>Protect what people<br /><em>depend on.</em></h1>
      <p class="lead">Every payment, patient record, online business and AI assistant depends on trust. Cybersecurity is the work of making that trust deserved—and helping people recover when things go wrong.</p>
      <p>You can begin without an IT background. Start with curiosity, learn how systems work, and build useful skills one practical step at a time.</p>
      <div class="button-row"><a class="button" href="#lesson/O01/learn">Start from the beginning ↗</a><a class="button secondary" href="#path">See your learning path</a></div>
    </header>

    <section aria-labelledby="cyber-meaning">
      <span class="eyebrow">THE IDEA IN EVERYDAY LANGUAGE</span>
      <h2 id="cyber-meaning">Help people use technology safely.</h2>
      <p>Cybersecurity protects devices, software, information and digital services against unwanted access, harmful changes and disruption. It combines engineering, investigation, risk decisions and clear communication. ${cite("definition", "NCSC: what cybersecurity means")}</p>
      <div class="intro-principles">
        <div><strong>Keep it private.</strong><p>A patient’s medical record reaches the people entitled to see it.</p></div>
        <div><strong>Keep it correct.</strong><p>A payment amount cannot be changed without permission.</p></div>
        <div><strong>Keep it available.</strong><p>A service keeps working, or has a tested way to recover.</p></div>
      </div>
      <p>Sometimes the job is repairing an access check in code. Sometimes it is investigating a suspicious login, testing a backup, or helping a team make a safer decision. Your work connects technical details to consequences people can understand.</p>
    </section>

    <section aria-labelledby="cyber-purpose">
      <h2 id="cyber-purpose">The skills matter before your first job.</h2>
      <p>You can use what you learn to protect your own accounts, recognise risky requests, preserve important files and build safer software. In an organisation, the same habits help protect customers, maintain essential services and reduce the cost of mistakes and attacks.</p>
      <p>The field offers several ways to contribute: careful analysis, good software, sound processes, patient teaching and responsible research. You can build on an existing strength while developing the technical foundations around it.</p>
    </section>

    <section class="intro-ai" aria-labelledby="cyber-ai">
      <span class="eyebrow">CYBERSECURITY IN THE AI AGE</span>
      <h2 id="cyber-ai">AI changes the work. Security expertise still matters.</h2>
      <p>AI can help organise evidence, draft queries and assist code review. Those outputs still need appropriate validation before a team relies on them. The opportunity is to understand both the system and the tool well enough to judge the result.</p>
      <div class="career-grid">
        <article class="career-card"><h3>More systems need securing.</h3><p>AI applications connect models to private data, retrieval stores and tools. Teams must decide which documents a user may retrieve, which actions an agent may take, and how to protect credentials and logs.</p><a href="#lesson/I03/learn">Explore retrieval security ↗</a></article>
        <article class="career-card"><h3>Attackers can use AI too.</h3><p>The NCSC’s 2025 assessment expects AI to make parts of cyber intrusion more effective through 2027. This is a forecast, and it also recognises defensive benefits. Keeping systems patched and well protected remains valuable. ${cite("aiThreat", "Read the assessment")}</p></article>
        <article class="career-card"><h3>Someone must own the decision.</h3><p>Organisations need people accountable for risk, deployment and response. NIST’s AI framework assigns responsibilities to teams and leadership. An AI-generated recommendation does not itself authorise access or accept business risk. ${cite("aiGovernance", "NIST: AI governance")}</p></article>
        <article class="career-card"><h3>Context and evidence count.</h3><p>A useful security decision connects a finding to the affected service, the people using it and the cost of a repair. Practise explaining what your evidence supports, checking tool output and choosing a proportionate response.</p><a href="#lesson/I04/learn">Explore agent authorisation ↗</a></article>
      </div>
      <p><strong>The employment evidence is mixed, not a promise of immunity.</strong> The UK’s 2026 study reports AI use by staff in 70% of surveyed cyber businesses. Interviewees also described pressure on routine junior work and a competitive entry market. These qualitative concerns are not a measured count of jobs lost to AI. ${cite("uk", "UK study: AI skills and entry routes")}</p>
      <p>Build foundations, learn to use AI critically, and learn to secure AI systems themselves. Our <a href="#lesson/I01/learn">eight-topic AI security track</a> connects these ideas through supplied examples and exercises. No one can guarantee that a particular job title will stay unchanged.</p>
    </section>

    <section aria-labelledby="cyber-careers">
      <span class="eyebrow">FIND A DIRECTION THAT INTERESTS YOU</span>
      <h2 id="cyber-careers">There is more than one kind of cybersecurity career.</h2>
      <p>These are example directions, with titles and entry requirements that vary by employer. Some are destinations to grow into after building experience.</p>
      <div class="career-grid">
        ${role("Security operations & detection", "Investigate alerts, connect events and improve rules that help a team spot trouble.", "you like patterns, patient investigation and explaining evidence.", "D05", "security logs")}
        ${role("Application & product security", "Review how software handles data and permissions, help developers repair weaknesses and verify the fix.", "you enjoy building software and understanding why a bug occurs.", "W18", "application security")}
        ${role("Cloud & identity security", "Design access boundaries for people, services and workloads, then check their effective permissions.", "you enjoy systems, architecture and careful configuration.", "D03", "cloud security")}
        ${role("Incident response & forensics", "Help contain incidents, preserve evidence, reconstruct events and support recovery.", "you like structured investigations and calm communication.", "D08", "incident response")}
        ${role("Risk, governance & assurance", "Connect threats to business priorities, review controls and help teams make defensible decisions.", "you enjoy analysis, writing, processes and working across teams.", "G01", "risk decisions")}
        ${role("Authorised security testing", "Test agreed systems within a written scope and produce evidence that helps their owners improve them.", "you enjoy methodical problem-solving and clear technical reports.", "W01", "scoped testing")}
        ${role("AI security engineering", "Protect AI data flows, retrieval, tools and agent actions, and build evidence for their security boundaries.", "you want to combine software security with AI-system design.", "I01", "AI security")}
      </div>
    </section>

    <section aria-labelledby="cyber-employers">
      <h2 id="cyber-employers">Work where digital trust matters.</h2>
      <p>Explore security teams inside organisations, specialist service providers and research groups. Examples of places to investigate include:</p>
      <ul class="employer-list"><li>Banks, insurers, payments companies and fintechs</li><li>Software companies, cloud providers and AI businesses</li><li>Hospitals, healthcare services and medical-technology companies</li><li>Telecoms and internet providers</li><li>Government, education and public-service organisations</li><li>Energy, transport and manufacturing organisations</li><li>Security consultancies and managed security service providers</li><li>Universities and research laboratories</li></ul>
      <p>For a search in Nigeria, these categories are a starting list of sectors to explore, not a claim that a particular employer is recruiting today. Use current employer adverts to check the actual role and requirements.</p>
      <p>Jobs may be on site, hybrid or remote. Remote does not automatically mean an employer can hire in every country. Check the permitted location, working hours, employment arrangement and any vetting requirements. Incident-focused roles can involve shifts or on-call work. ${cite("us", "US occupation profile")} · ${cite("ukPay", "UK career profile")}</p>
    </section>

    <section aria-labelledby="cyber-hiring">
      <span class="eyebrow">TURN INTEREST INTO EMPLOYABLE EVIDENCE</span>
      <h2 id="cyber-hiring">There is opportunity. Your first role takes preparation.</h2>
      <p>The US Bureau of Labor Statistics projects <strong>21% growth for information security analysts from 2025 to 2035</strong>. That is a forecast for one US occupation, not a global vacancy count or a personal hiring probability. ${cite("us", "BLS job outlook")}</p>
      <p>The UK’s 2026 study found core cyber job postings rose 7% in 2025 compared with 2024, while documenting continuing entry barriers. A need for experienced specialists can coexist with competition among beginners. ${cite("uk", "UK demand and entry evidence")}</p>
      <p>You can make your application more convincing by showing a small piece of work you understand deeply: the problem, your method, the result, the limits and the repair. Relevant experience may come through an internship, apprenticeship, placement, IT support, systems administration or software work. Requirements differ; read real adverts early.</p>
      <ol class="career-steps"><li><strong>Build the foundations.</strong> Learn operating systems, networks, identity and clear technical writing. Start with <a href="#lesson/O01/learn">O01</a> if these are new.</li><li><strong>Choose an initial direction.</strong> Review several current adverts for that direction in your target location. Keep a list of repeated skills and genuine gaps.</li><li><strong>Make two or three reviewable projects.</strong> For example: a synthetic log investigation, an ownership-check repair, or an AI-agent permission design. Explain every result and keep out real secrets.</li><li><strong>Get feedback and practical experience.</strong> Ask someone to challenge the reasoning. Look for supervised opportunities and apply when you can demonstrate the relevant requirements; completing every advanced topic is not a prerequisite for every junior application.</li><li><strong>Use certification deliberately.</strong> Choose an exam relevant to your intended role and budget. <a href="#certifications">Compare the certification routes</a> and keep building practical evidence alongside it.</li></ol>
      <p>A certificate, degree or course record can support an application. Employers still assess the particular candidate and role. Some entry routes have formal educational requirements; others value a different combination of experience and demonstrable skills.</p>
    </section>

    <section aria-labelledby="cyber-pay">
      <span class="eyebrow">PAY, WITH THE CONTEXT THAT MAKES IT USEFUL</span>
      <h2 id="cyber-pay">Earnings can be attractive—and vary widely.</h2>
      <p>Role, location, experience, employer and responsibility all affect compensation. These examples describe different markets and measures. They are annual figures in the original currency, not directly comparable offers.</p>
      <div class="pay-grid">
        <article class="pay-card"><span class="eyebrow">UNITED STATES · INFORMATION SECURITY ANALYSTS</span><h3>US$129,180 <small>per year</small></h3><p>Median wage, May 2025. Half earned above and half below it. The highest-paid 10% earned more than US$199,850.</p><p>A percentile is not an experience band. This is neither a starting-salary range nor a rate for every security specialty. ${cite("us", "BLS wage data")}</p></article>
        <article class="pay-card"><span class="eyebrow">UNITED KINGDOM · CYBER INTELLIGENCE OFFICER</span><h3>£32,000–£65,000 <small>per year</small></h3><p>The National Careers Service lists £32,000 for a starter and £65,000 for an experienced worker in this particular role.</p><p>This is career-profile guidance, not a survey median or a guaranteed offer. Page checked 30 October 2026. ${cite("ukPay", "Read the role and salary profile")}</p></article>
      </div>
      <div class="callout"><strong>Use your own market when planning.</strong><p>These US/UK figures are not Nigerian salary estimates or promises of remote dollar pay. Compare current local adverts and actual offers. Check currency, employee versus contractor terms, benefits, working hours and recurring costs. This page does not give a Nigeria-wide figure because these sources do not establish one.</p></div>
    </section>

    <section class="intro-next" aria-labelledby="cyber-start">
      <span class="eyebrow">YOU DO NOT NEED TO UNDERSTAND IT ALL TODAY</span>
      <h2 id="cyber-start">Your first step can be small.</h2>
      <p>Learn one idea. Work through its example. Save a result you can explain. Repeat, ask better questions, and let those small pieces become a body of work.</p>
      <div class="button-row"><a class="button" href="#lesson/O01/learn">Begin your first lesson ↗</a><a class="button secondary" href="#path">Explore the curriculum</a><a href="#certifications">Plan a certification ↗</a></div>
    </section>
    <p class="fine-print intro-source-note">Sources checked 30 October 2026. Statistics retain their own data periods; forecasts and employer interview views are labelled above. Pay and hiring conditions change. This is career orientation, not an employment or earnings guarantee.</p>
  </article>`;
}

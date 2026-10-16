// Original examples audited against the linked primary references. Stable lesson IDs preserve saved work.
export const systemSources = {
  roadmap: ["Design Gurus · learning sequence", "https://www.designgurus.io/blog/system-design-for-beginners"],
  framework: ["Design Gurus · design framework", "https://www.designgurus.io/blog/step-by-step-guide"],
  neetcode: ["NeetCode · foundations before interview designs", "https://neetcode.io/courses"],
  http: [
    "MDN · client and server",
    "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview",
  ],
  transactions: ["PostgreSQL · transactions", "https://www.postgresql.org/docs/current/tutorial-transactions.html"],
  indexes: ["PostgreSQL · indexes", "https://www.postgresql.org/docs/current/indexes-intro.html"],
  replication: ["PostgreSQL · standby servers", "https://www.postgresql.org/docs/current/warm-standby.html"],
  cache: ["MDN · HTTP caching", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching"],
  retries: ["AWS · timeouts, retries, and jitter", "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/"],
  idempotency: ["AWS · making retries safe", "https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/"],
  queues: [
    "AWS · at-least-once delivery",
    "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues-at-least-once-delivery.html",
  ],
  cap: ["Gilbert & Lynch · the CAP impossibility result", "https://www.comp.nus.edu.sg/~gilbert/pubs/BrewersConjecture-SigAct.pdf"],
  consistency: ["Werner Vogels · eventual consistency", "https://www.allthingsdistributed.com/2008/12/eventually_consistent.html"],
  patterns: ["Martin Fowler · distributed systems patterns", "https://martinfowler.com/articles/patterns-of-distributed-systems/"],
  simplicity: ["Martin Fowler · monolith first", "https://martinfowler.com/bliki/MonolithFirst.html"],
  security: ["OWASP · object-level authorization", "https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/"],
  slo: ["Google SRE · service level objectives", "https://sre.google/sre-book/service-level-objectives/"],
  recall: ["Karpicke & Roediger · retrieval practice research", "https://learninglab.psych.purdue.edu/downloads/2007/2007_Karpicke_Roediger_JML.pdf"],
  isolation: ["PostgreSQL · concurrent conditional updates", "https://www.postgresql.org/docs/current/transaction-iso.html"],
  outbox: [
    "AWS · transactional outbox and duplicate delivery",
    "https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html",
  ],
  uploads: [
    "AWS S3 · reusable presigned URLs and object replacement",
    "https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html",
  ],
  redirects: ["MDN · permanent redirects", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/301"],
  realtime: [
    "MDN · WebSocket client lifecycle",
    "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications",
  ],
  recovery: [
    "AWS · recovery objectives and strategies",
    "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
  ],
  throttling: ["IETF RFC 6585 · 429 Too Many Requests", "https://www.rfc-editor.org/rfc/rfc6585#section-4"],
  capExplanation: ["Eric Brewer · CAP and network partitions", "https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/"],
};
export const systemStages = [
  {
    title: "Make one system work",
    summary: "Follow a request, check access, and keep saved facts correct.",
  },
  {
    title: "Handle more work",
    summary: "Measure a bottleneck before adding another moving part.",
  },
  {
    title: "Keep working when things fail",
    summary: "Reason about retries, copies, disagreement, and overload.",
  },
  {
    title: "Protect and operate the system",
    summary: "Limit overload, investigate failures, and plan recovery.",
  },
  {
    title: "Design complete systems",
    summary: "Bring the ideas together in six practical design studios.",
  },
];
export const systemLessons = [
  {
    id: "requirements",
    stage: 0,
    title: "Start with the person, not the boxes",
    idea: "A useful design starts with a clear job for a real person.",
    explain: [
      "Imagine a library with one copy of a book. Two readers want it. Before choosing software, decide what a successful reservation means.",
      "First, name the person and the job: a reader reserves a book. Then state a rule: only one reader can hold that copy at a time.",
      "A speed target is a separate promise. For example, aim to answer most reservation requests within one second. State the expected traffic when you set that target.",
      "Choose what to leave out. A first version can reserve books without also recommending them or calculating late fees.",
    ],
    walk: [
      "Name the person who needs help.",
      "Write the action the reader can take.",
      "Write the rule that must stay true.",
      "Keep the first version small.",
    ],
    pitfall: "‘Handle millions of users’ does not tell you how many requests arrive at once. Ask for a measurable workload.",
    check: {
      prompt: "The library has one copy left. Which requirement tells you what must stay correct?",
      options: ["Use five servers", "Only one reader can reserve that copy", "Use a popular database"],
      answer: 1,
      why: [
        "A server count is a design choice. It does not state the rule.",
        "Yes. This rule lets you judge whether a proposed design is safe.",
        "A product name does not explain what the system must guarantee.",
      ],
    },
    task: "Design the first version of a study-group booking tool. Write its user, two actions, one correctness rule, and one feature you will leave out.",
    rubric: ["I named a user and two actions.", "I wrote a rule that can be tested.", "I deliberately left something out."],
    solution:
      "Students can create a study group and reserve a seat. A group has a fixed seat limit. Confirmed reservations must never exceed that limit. Assume one campus and 100 bookings per day. Leave chat out of the first version. Begin by considering one application and a database. Explain how they would enforce the seat rule.",
    diagram: ["Student", "Booking server", "Reservations"],
    sources: ["framework", "roadmap"],
    terms: [
      ["Requirement", "Something the system needs to do or a rule it needs to meet."],
      ["Scope", "The features included in this version."],
      ["Trade-off", "A choice that gains one benefit at the cost of another."],
    ],
    scenario: "A library has one copy of Book 42. A reader wants to reserve it.",
    frames: [
      {
        action: "Name the person who needs help.",
        facts: [
          ["Person", "A reader using a phone"],
          ["Book", "Book 42"],
        ],
        why: "A person and a job give the design a clear purpose.",
        focus: 0,
      },
      {
        action: "Write the action the reader can take.",
        facts: [
          ["Action", "Reserve Book 42"],
          ["Success", "The reader gets a reservation ID"],
        ],
        why: "You can now describe what a successful request returns.",
        focus: 1,
      },
      {
        action: "Write the rule that must stay true.",
        facts: [
          ["Copies available", "1"],
          ["Maximum active reservations", "1"],
        ],
        why: "Two confirmations for this one copy would break the rule.",
        focus: 2,
      },
      {
        action: "Keep the first version small.",
        facts: [
          ["Included", "Create and view a reservation"],
          ["Left out", "Recommendations and late fees"],
        ],
        why: "Leaving features out makes the first design easier to build and check.",
        focus: 1,
      },
    ],
    solutionSteps: [
      "Students can create a study group and reserve a seat.",
      "A group has a fixed seat limit. Confirmed reservations must never exceed that limit.",
      "Assume one campus and 100 bookings per day. Leave chat out of the first version.",
      "Begin by considering one application and a database. Explain how they would enforce the seat rule.",
    ],
    concepts: [],
  },
  {
    id: "request",
    stage: 0,
    title: "Follow one request all the way",
    idea: "A browser asks. A server does the work. A database remembers.",
    explain: [
      "Your browser is a client: it asks another program for something. A server receives that request, does the work, and sends a response.",
      "A database stores information that should survive an application restart. A value kept only in an application variable can disappear when that process stops.",
      "On the web, DNS helps find the server address. HTTPS protects data as it travels between the browser and the server. A reverse proxy can receive the request and pass it to the application.",
      "Follow one request through the system before adding more boxes. First ask what the browser sends, what the server checks, and where the data lives.",
    ],
    walk: [
      "The browser asks for the note.",
      "The server verifies the caller and permission.",
      "The application reads the saved record.",
      "The response returns to the browser.",
    ],
    pitfall:
      "A successful screen update does not prove the database saved anything. Send success only when the required durable write has succeeded.",
    check: {
      prompt: "The app restarts. Where should confirmed reservations survive?",
      options: ["Only in a variable inside the server", "Only in the button’s text", "In durable storage such as the database"],
      answer: 2,
      why: [
        "Process memory can disappear during a restart.",
        "A label in a browser is not shared durable storage.",
        "Yes. The database should be the source of truth for confirmed reservations.",
      ],
    },
    task: "Trace a student saving a lesson note: request, identity check, database write, response. Explain what happens if the write fails.",
    rubric: ["I traced the request and response.", "I named where the note is stored.", "I did not report success after a failed write."],
    solution:
      "The browser sends the lesson ID and note text over HTTPS. The server verifies the sign-in information and checks ownership. The server saves the note in the database and reports success only after that write succeeds. If the write fails, show an error and keep the unsaved browser draft so the learner can retry.",
    diagram: ["Browser", "Application", "Database"],
    sources: ["http"],
    terms: [
      ["Client", "The program making the request, such as your browser."],
      ["Server", "A program that handles requests."],
      ["Durable storage", "Storage intended to keep data after the application process stops."],
    ],
    scenario: "Student 7 opens their saved note for Lesson 42.",
    frames: [
      {
        action: "The browser asks for the note.",
        facts: [
          ["Caller", "Student 7"],
          ["Requested lesson", "42"],
        ],
        why: "The request identifies the resource. It must also include sign-in information the server can verify.",
        focus: 0,
      },
      {
        action: "The server verifies the caller and permission.",
        facts: [
          ["Verified student", "7"],
          ["Allowed records", "Notes owned by Student 7"],
        ],
        why: "A request must not be allowed to read another learner’s private note.",
        focus: 1,
      },
      {
        action: "The application reads the saved record.",
        facts: [
          ["Database lookup", "Student 7 + Lesson 42"],
          ["Stored note", "Try a smaller example"],
        ],
        why: "The database, rather than a temporary browser label, supplies the saved value.",
        focus: 2,
      },
      {
        action: "The response returns to the browser.",
        facts: [
          ["Response", "200 with the saved note"],
          ["Visible text", "Try a smaller example"],
        ],
        why: "The browser displays the result. A failed database read should produce an error instead of an invented success.",
        focus: 0,
      },
    ],
    solutionSteps: [
      "The browser sends the lesson ID and note text over HTTPS.",
      "The server verifies the sign-in information and checks ownership.",
      "The server saves the note in the database and reports success only after that write succeeds.",
      "If the write fails, show an error and keep the unsaved browser draft so the learner can retry.",
    ],
    concepts: ["requirements"],
  },
  {
    id: "api",
    stage: 0,
    title: "Give each request a clear contract",
    idea: "An API is an agreement about what to send and what comes back.",
    explain: [
      "An API contract says what a request must contain and what a response means. Write it down before implementing the endpoint.",
      "For example, POST /reservations asks to create a booking. The request names the study group. The server finds the student’s identity from verified sign-in information.",
      "Describe failures too. A missing sign-in needs a different response from a study group with no seats left.",
      "Return long lists a page at a time. A cursor marks where the next page starts. Define a stable order so records with the same date do not get mixed up.",
    ],
    walk: [
      "Send a creation request.",
      "Find the caller from verified sign-in information.",
      "Describe a successful response.",
      "Describe a full-group response.",
    ],
    pitfall: "Do not trust an account ID in the request body as proof of who is making the request.",
    check: {
      prompt: "A request says user_id = 7. What should establish the caller’s identity?",
      options: ["The verified sign-in session", "The number in the body", "The button the caller clicked"],
      answer: 0,
      why: [
        "Yes. The server verifies identity and then checks permission.",
        "Anyone can change a request body.",
        "Clients can send requests without using your buttons.",
      ],
    },
    task: "Write a small API contract for reading one page of your own notes. Include input, success, next-page marker, and an expired-session response.",
    rubric: ["I included a page size or cursor.", "The server derives the caller’s identity.", "I included an error response."],
    solution:
      "GET /notes accepts a bounded page size and an optional next-page cursor. The server verifies the caller and returns only notes that caller may read. A successful response has items and next_cursor. Use a stable order with a unique ID to break ties; return null when there is no next page. For missing or expired sign-in information, return 401 and let the client ask the learner to sign in.",
    diagram: ["Request + session", "Validate + authorize", "Result or error"],
    sources: ["http", "security"],
    terms: [
      ["Endpoint", "An API address for an operation, such as /reservations."],
      ["Contract", "The agreed input, result, and failure behavior."],
      ["Cursor", "A marker used to request the next page of results."],
    ],
    scenario: "Student 7 asks to join Study Group 42. These numbers identify different things.",
    frames: [
      {
        action: "Send a creation request.",
        facts: [
          ["Method and path", "POST /reservations"],
          ["Body", "study_session_id: 42"],
        ],
        why: "A study-session ID identifies the group being booked. It is different from a sign-in session.",
        focus: 0,
      },
      {
        action: "Find the caller from verified sign-in information.",
        facts: [
          ["Caller", "Student 7"],
          ["Do not trust", "An arbitrary student ID supplied in the body"],
        ],
        why: "The caller must not be able to book as another student.",
        focus: 1,
      },
      {
        action: "Describe a successful response.",
        facts: [
          ["HTTP status", "201 Created"],
          ["Response", "reservation_id: 83, status: confirmed"],
        ],
        why: "A stable reservation ID lets the caller refer to the saved booking.",
        focus: 2,
      },
      {
        action: "Describe a full-group response.",
        facts: [
          ["If there are no seats", "409 Conflict"],
          ["Message", "This study group is full"],
        ],
        why: "Clients can give useful feedback only when failures have clear meanings.",
        focus: 0,
      },
    ],
    solutionSteps: [
      "GET /notes accepts a bounded page size and an optional next-page cursor.",
      "The server verifies the caller and returns only notes that caller may read.",
      "A successful response has items and next_cursor. Use a stable order with a unique ID to break ties; return null when there is no next page.",
      "For missing or expired sign-in information, return 401 and let the client ask the learner to sign in.",
    ],
    concepts: ["request"],
  },
  {
    id: "authorization",
    stage: 0,
    title: "Signing in is only the first check",
    idea: "Identity says who you are. Authorization says which records you may use.",
    explain: [
      "Signing in answers “Who is this person?” It does not mean that person may read every record.",
      "Authorization is the next check: “May this person read or change this particular note?” A private note should normally be available only to its owner.",
      "Enforce that rule in the server or database. Hiding a button cannot protect the API, because a caller can send a request without using the interface.",
      "Check reads, updates, and attachment downloads. If you add sharing, state who can read and who can edit. Keep privileged credentials away from the browser.",
    ],
    walk: [
      "Receive a request for Note 500.",
      "Check the record’s owner.",
      "Check whether an explicit sharing rule allows this read.",
      "Refuse access without returning private content.",
    ],
    pitfall: "Changing a URL’s record ID must not be enough to read someone else’s data.",
    check: {
      prompt: "A signed-in learner changes a note ID to someone else’s. What should protect the note?",
      options: ["A hidden edit button", "A long but public record ID", "A server or database ownership check"],
      answer: 2,
      why: [
        "Requests can bypass the interface.",
        "Hard-to-guess IDs are not a permission system.",
        "Yes. Verify identity and permission for the requested record.",
      ],
    },
    task: "Write an access rule for private notes and a deliberately shared study-group note. Cover reads and updates.",
    rubric: [
      "I derived identity from a verified session.",
      "I checked access per record and operation.",
      "I separated private ownership and explicit sharing.",
    ],
    solution:
      "For a private note, derive the caller’s identity from verified sign-in information and check that caller owns the note. Apply the ownership rule to both reads and writes. For an explicitly shared group note, let current members read and only designated editors change it. Recheck permission when membership changes and before attachment downloads. Enforce these rules in the server or database.",
    diagram: ["Verified identity", "Object + permission", "Allowed data only"],
    sources: ["security"],
    terms: [
      ["Authentication", "Checking who a caller is."],
      ["Authorization", "Checking what that caller is allowed to do."],
      ["Ownership", "Which account a record belongs to."],
    ],
    scenario: "Student 7 is signed in. Note 500 belongs to Student 9 and is private.",
    frames: [
      {
        action: "Receive a request for Note 500.",
        facts: [
          ["Caller’s requested ID", "500"],
          ["Verified caller", "Student 7"],
        ],
        why: "The caller can type a different record ID. The ID itself is not permission.",
        focus: 0,
      },
      {
        action: "Check the record’s owner.",
        facts: [
          ["Note owner", "Student 9"],
          ["Caller", "Student 7"],
        ],
        why: "The owner and caller differ, so the ordinary private-note rule does not allow access.",
        focus: 1,
      },
      {
        action: "Check whether an explicit sharing rule allows this read.",
        facts: [
          ["Shared with Student 7", "No"],
          ["Read allowed", "No"],
        ],
        why: "Some records may be shared deliberately. That exception needs an actual rule, not a guess.",
        focus: 1,
      },
      {
        action: "Refuse access without returning private content.",
        facts: [
          ["Response", "No private note text"],
          ["Apply the same rule to", "Edits and attachment downloads"],
        ],
        why: "You can use a suitable 403 or 404 policy, while consistently withholding unauthorized data.",
        focus: 2,
      },
    ],
    solutionSteps: [
      "For a private note, derive the caller’s identity from verified sign-in information and check that caller owns the note.",
      "Apply the ownership rule to both reads and writes.",
      "For an explicitly shared group note, let current members read and only designated editors change it.",
      "Recheck permission when membership changes and before attachment downloads. Enforce these rules in the server or database.",
    ],
    concepts: ["api"],
  },
  {
    id: "data",
    stage: 0,
    title: "Store facts around the questions you ask",
    idea: "Choose a data shape by writing the reads and writes it must support.",
    explain: [
      "Start by listing the questions the app must answer. For a booking app: who is attending this study group, and which groups has this student booked?",
      "Store each study group and student with a stable ID. A reservation record connects those two IDs.",
      "A relational database stores records in tables and can enforce rules between them. A document database groups related fields into documents. Choose based on the reads, updates, and rules you need.",
      "A database choice does not remove the need for a clear data model. Make the relationships and duplicate-record rules explicit.",
    ],
    walk: ["Store the study group’s own facts.", "Store who made the reservation.", "Write the read you need.", "State a duplicate rule."],
    pitfall: "Putting a whole app into one growing document can make unrelated updates compete and create very large reads.",
    check: {
      prompt: "Which question is most useful before choosing a data store?",
      options: ["Which logo looks best?", "What must we read, update, and keep correct?", "Which product always wins?"],
      answer: 1,
      why: ["Branding does not establish the workload.", "Yes. Workload and constraints guide the choice.", "There is no universally best database."],
    },
    task: "Sketch records for students, lessons, and saved notes. Show how you find one student’s note for one lesson.",
    rubric: ["I gave records stable IDs.", "I showed relationships.", "I named the query and a uniqueness rule."],
    solution:
      "Use student and lesson IDs to identify the owner and subject of a note. Store notes with student_id, lesson_id, text, and updated_at. If each learner has one current note per lesson, enforce uniqueness on the pair (student_id, lesson_id). To read it, verify the caller and look up that caller’s ID together with the lesson ID.",
    diagram: ["Students", "Notes link both IDs", "Lessons"],
    sources: ["transactions", "framework"],
    terms: [
      ["Data model", "The facts you store and how they relate."],
      ["Stable ID", "An identifier that continues to refer to the same record."],
      ["Constraint", "A rule the database enforces, such as a unique pair of IDs."],
    ],
    scenario: "Student 7 reserves a place in Study Group 42.",
    frames: [
      {
        action: "Store the study group’s own facts.",
        facts: [
          ["Table", "study_sessions"],
          ["Example row", "id: 42, title: Graph practice, seat_limit: 8"],
        ],
        why: "The group title and seat limit belong to the study group.",
        focus: 2,
      },
      {
        action: "Store who made the reservation.",
        facts: [
          ["Table", "reservations"],
          ["Example row", "id: 83, study_session_id: 42, student_id: 7"],
        ],
        why: "The two IDs connect a student to a group.",
        focus: 1,
      },
      {
        action: "Write the read you need.",
        facts: [
          ["Question", "Which groups did Student 7 reserve?"],
          ["Filter", "student_id = 7"],
        ],
        why: "A concrete query helps you choose the data layout and, later, an index.",
        focus: 0,
      },
      {
        action: "State a duplicate rule.",
        facts: [
          ["Rule", "At most one active reservation per student and group"],
          ["Important limit", "That rule alone does not enforce total seat capacity"],
        ],
        why: "Uniqueness and total capacity are separate rules. The next lesson handles competing seat claims.",
        focus: 1,
      },
    ],
    solutionSteps: [
      "Use student and lesson IDs to identify the owner and subject of a note.",
      "Store notes with student_id, lesson_id, text, and updated_at.",
      "If each learner has one current note per lesson, enforce uniqueness on the pair (student_id, lesson_id).",
      "To read it, verify the caller and look up that caller’s ID together with the lesson ID.",
    ],
    concepts: ["authorization"],
  },
  {
    id: "transactions",
    stage: 0,
    title: "Keep related changes together",
    idea: "A transaction groups changes so they commit together or roll back together.",
    explain: [
      "Suppose one seat is left and two students press Book. If both read “one seat left” before either saves, both may think they can book it.",
      "A transaction groups database changes. The changes commit together, or they are undone together. That keeps a seat claim and its reservation record in agreement.",
      "For this example, ask PostgreSQL to increase the booked count only if there is still room. The check and increase happen in one conditional update to the chosen study-group row.",
      "A transaction around a separate read and write is not automatically enough. The database’s isolation rules still matter. Here we use a conditional row update, inspect its result, and roll back on failure.",
    ],
    walk: [
      "A begins a transaction and makes a conditional seat claim.",
      "A inserts its reservation and commits.",
      "After A saves the booking, B checks the seat again.",
      "B reports that the group is full.",
    ],
    pitfall: "Checking availability in the browser is helpful feedback, but it cannot enforce a shared correctness rule.",
    check: {
      prompt: "Two requests compete for the last seat. Which plan can protect it?",
      options: [
        "Both read the count, then both insert",
        "Disable the button in one browser",
        "Use a conditional database update and reservation in one transaction",
      ],
      answer: 2,
      why: [
        "Both requests can read the same old count.",
        "Other browsers can still book.",
        "Yes. Check the database result and commit the claim with the reservation.",
      ],
    },
    task: "Describe a safe last-seat booking. Include what the losing request sees and what happens if inserting the reservation fails.",
    rubric: [
      "The seat claim is coordinated in the database.",
      "The reservation and claim commit together.",
      "I explained failure and the losing request.",
    ],
    solution:
      "Begin a transaction for the selected study-group row. Use an atomic conditional update: increase booked only where the group ID matches and booked < seat_limit. Check how many rows changed. If one row changed, insert the reservation and commit both changes. Also enforce the intended per-student uniqueness rule. If no row changed, report full or the relevant missing-group error. If insertion fails, roll back. Handle retryable transaction errors using a safe retry plan.",
    diagram: ["Two booking requests", "Atomic seat claim", "One confirmed booking"],
    sources: ["transactions", "isolation"],
    terms: [
      ["Commit", "Make the transaction’s changes permanent."],
      ["Roll back", "Undo the transaction’s changes."],
      ["Atomic update", "One database operation that performs the check and change together."],
      ["Isolation", "The rules for how transactions interact while running at the same time."],
    ],
    scenario: "Study Group 42 has seat_limit = 1 and booked = 0. Students A and B compete for that last seat in PostgreSQL.",
    frames: [
      {
        action: "A begins a transaction and makes a conditional seat claim.",
        facts: [
          ["Condition", "id = 42 AND booked < seat_limit"],
          ["Change", "booked becomes 1 in A’s transaction"],
        ],
        why: "The database coordinates updates to this same row. B may need to wait for A.",
        focus: 1,
      },
      {
        action: "A inserts its reservation and commits.",
        facts: [
          ["Committed booked count", "1"],
          ["Committed reservation", "A → Group 42"],
        ],
        why: "Both records become visible together. If insertion failed, A would roll back the count change.",
        focus: 2,
      },
      {
        action: "After A saves the booking, B checks the seat again.",
        facts: [
          ["Condition now", "1 < 1 is false"],
          ["Rows changed by B", "0"],
        ],
        why: "A has taken the only seat. B’s update changes no row, so the app must not confirm B’s booking.",
        focus: 1,
      },
      {
        action: "B reports that the group is full.",
        facts: [
          ["Confirmed students", "A only"],
          ["B’s result", "No seat available"],
        ],
        why: "The app must check the affected-row count. Zero changed rows do not mean a reservation succeeded.",
        focus: 0,
      },
    ],
    solutionSteps: [
      "Begin a transaction for the selected study-group row.",
      "Use an atomic conditional update: increase booked only where the group ID matches and booked < seat_limit. Check how many rows changed.",
      "If one row changed, insert the reservation and commit both changes. Also enforce the intended per-student uniqueness rule.",
      "If no row changed, report full or the relevant missing-group error. If insertion fails, roll back. Handle retryable transaction errors using a safe retry plan.",
    ],
    concepts: ["data"],
  },
  {
    id: "indexes",
    stage: 1,
    title: "Find a record without reading them all",
    idea: "An index is an extra lookup structure that can make a query faster.",
    explain: [
      "A library catalogue helps you find a book without walking past every shelf. A database index serves a similar purpose: it keeps an extra structure for finding matching records.",
      "Suppose you often list one student’s reservations, newest first. An index beginning with student_id and then the ordering fields may help that query.",
      "The database must update the index when relevant records change. That uses storage and adds write work.",
      "Inspect the query plan to see how the database actually finds the rows. Measure with realistic data before assuming an index helped.",
    ],
    walk: ["State the query.", "Consider an index for that access pattern.", "Inspect the actual query plan.", "Count the cost on writes too."],
    pitfall: "An index on every column is not a free speed upgrade. Writes must maintain those extra structures.",
    check: {
      prompt: "You add an index to speed up note reads. What cost should you consider?",
      options: ["Extra storage and write work", "It always deletes old notes", "It makes every query equally fast"],
      answer: 0,
      why: [
        "Yes. Faster access can trade off against storage and update cost.",
        "Creating an ordinary index does not delete note records.",
        "An index helps some access patterns, not all queries.",
      ],
    },
    task: "Choose an index for listing one student’s reservations newest first. State the query and one cost of the index.",
    rubric: ["The index matches a stated query.", "The ordering has a unique tie-breaker.", "I named storage or write overhead."],
    solution:
      "Filter reservations by the verified student’s ID. Order by created_at and reservation_id so the ordering has a unique tie-breaker. Consider a composite index beginning with student_id and matching that ordering. Inspect the actual query plan. Compare read latency with realistic data and account for the extra storage and index updates on writes.",
    diagram: ["Query", "Index lookup", "Matching records"],
    sources: ["indexes"],
    terms: [
      ["Index", "An extra lookup structure maintained by the database."],
      ["Composite index", "An index built from more than one field."],
      ["Query plan", "The database’s chosen steps for answering a query."],
    ],
    scenario: "Student 7 wants their newest reservations. The table also contains other students’ reservations.",
    frames: [
      {
        action: "State the query.",
        facts: [
          ["Filter", "student_id = 7"],
          ["Order", "created_at descending, then reservation_id descending"],
        ],
        why: "The unique ID breaks ties when two records share a timestamp.",
        focus: 0,
      },
      {
        action: "Consider an index for that access pattern.",
        facts: [
          ["Candidate fields", "student_id, created_at, reservation_id"],
          ["Target benefit", "Find Student 7’s newest records without sorting the whole table"],
        ],
        why: "An index should match a real query, not a column chosen at random.",
        focus: 1,
      },
      {
        action: "Inspect the actual query plan.",
        facts: [
          ["Check", "Does PostgreSQL use a useful index scan?"],
          ["Measure", "Latency and work with realistic data"],
        ],
        why: "The planner may choose a scan for a small table. Adding an index is not proof of improvement.",
        focus: 2,
      },
      {
        action: "Count the cost on writes too.",
        facts: [
          ["New reservation", "One row plus relevant index updates"],
          ["Trade-off", "Faster useful reads may cost storage and write work"],
        ],
        why: "Keep indexes that help the workload enough to justify their maintenance.",
        focus: 1,
      },
    ],
    solutionSteps: [
      "Filter reservations by the verified student’s ID.",
      "Order by created_at and reservation_id so the ordering has a unique tie-breaker.",
      "Consider a composite index beginning with student_id and matching that ordering. Inspect the actual query plan.",
      "Compare read latency with realistic data and account for the extra storage and index updates on writes.",
    ],
    concepts: ["data", "transactions"],
  },
  {
    id: "estimates",
    stage: 1,
    title: "Turn a workload into small numbers",
    idea: "Estimate requests per second before guessing how many servers you need.",
    explain: [
      "Estimate work by multiplying small quantities. If 8,640 people each make 10 requests per day, the app receives 86,400 requests per day.",
      "There are 86,400 seconds in a day. Dividing gives an average of one request each second.",
      "Traffic is rarely steady all day. If you assume the busiest period is ten times the average, the estimated peak is 10 requests per second. Label that multiplier as an assumption.",
      "For storage, multiply new records by bytes per record and days retained. Then consider extra space for indexes, copies, and backups.",
    ],
    walk: [
      "Calculate requests per day.",
      "Convert the daily total into a per-second average.",
      "Apply the stated peak assumption.",
      "Estimate raw data growth separately.",
    ],
    pitfall: "Registered users are not simultaneous requests. Do not turn an account count directly into a server count.",
    check: {
      prompt: "86,400 requests per day gives what daily average?",
      options: ["86,400 requests per second", "1 request per second", "24 requests per second"],
      answer: 1,
      why: ["You still need to divide by seconds per day.", "Yes. There are 86,400 seconds in one day.", "Hours and seconds are different units."],
    },
    task: "Estimate average and peak requests for 17,280 users making 5 requests/day. Assume peak is 8× average. Write each calculation with units.",
    rubric: ["I calculated requests per day first.", "I divided by 86,400 seconds.", "I labelled the peak multiplier as an assumption."],
    solution:
      "17,280 users × 5 requests each = 86,400 requests per day. Divide by 86,400 seconds per day: the average is 1 request per second. Apply the stated 8× assumption: the estimated peak is 8 requests per second. Keep those units and assumptions in the design. Measure real traffic before choosing production capacity.",
    diagram: ["People × actions", "Requests/day", "Average → assumed peak"],
    sources: ["framework"],
    lab: "capacity",
    terms: [
      ["Average rate", "Total work divided by the time period."],
      ["Peak rate", "The workload during a busy interval."],
      ["Retention", "How long records are kept."],
    ],
    scenario: "8,640 daily users each make 10 requests. Assume the peak is 10 times the daily average.",
    frames: [
      {
        action: "Calculate requests per day.",
        facts: [
          ["Calculation", "8,640 users × 10 requests/user/day"],
          ["Result", "86,400 requests/day"],
        ],
        why: "Keep the units. Users and requests are different quantities.",
        focus: 0,
      },
      {
        action: "Convert the daily total into a per-second average.",
        facts: [
          ["Calculation", "86,400 requests ÷ 86,400 seconds"],
          ["Result", "1 request/second"],
        ],
        why: "This is an average across the whole day, not a busy-minute guarantee.",
        focus: 1,
      },
      {
        action: "Apply the stated peak assumption.",
        facts: [
          ["Calculation", "1 request/second × 10"],
          ["Estimated peak", "10 requests/second"],
        ],
        why: "The multiplier is a planning assumption. Real measurements may change it.",
        focus: 2,
      },
      {
        action: "Estimate raw data growth separately.",
        facts: [
          ["Assumption", "1,000 new records/day, 500 bytes each"],
          ["Raw growth", "500,000 bytes/day"],
        ],
        why: "This excludes indexes, replicas, and backups. Add those costs separately.",
        focus: 2,
      },
    ],
    solutionSteps: [
      "17,280 users × 5 requests each = 86,400 requests per day.",
      "Divide by 86,400 seconds per day: the average is 1 request per second.",
      "Apply the stated 8× assumption: the estimated peak is 8 requests per second.",
      "Keep those units and assumptions in the design. Measure real traffic before choosing production capacity.",
    ],
    concepts: ["requirements"],
  },
  {
    id: "metrics",
    stage: 1,
    title: "Speed and capacity are different questions",
    idea: "Latency is how long one request takes. Throughput is how much work finishes each second.",
    explain: [
      "Latency is the time one request takes. Throughput is the amount of work completed per second. A system can finish many requests while still making some people wait.",
      "An average can hide slow requests. Sort the timings and look near the slow end as well.",
      "The 95th percentile, called p95, is a timing at or below which about 95% of the observations fall. A common calculation uses the value at position ceil(0.95 × count) in the sorted list. Here, ceil means round up to a whole number.",
      "Measure errors too. A fast error is not a successful save. Define what counts, where timing starts, and the time window used for a target.",
    ],
    walk: [
      "Sort the twenty timings.",
      "Calculate p95 using the nearest-rank rule.",
      "Inspect the tail as well as p95.",
      "Keep volume and failures separate.",
    ],
    pitfall: "A low average is not proof that almost everyone gets a quick response.",
    check: {
      prompt: "Most reads take 50 ms, but some take 5 seconds. What helps reveal the slow group?",
      options: ["Only the daily request total", "Only the fastest request", "Latency percentiles and the distribution"],
      answer: 2,
      why: [
        "Volume does not tell you how long individual requests wait.",
        "The fastest request hides the slow ones.",
        "Yes. Inspect tail latency and errors under a stated load.",
      ],
    },
    task: "Define a speed target and a success-rate target for reading a saved note. Include a measurement window and which requests count.",
    rubric: ["I separated latency and success rate.", "I defined the eligible requests and window.", "My targets are measurable."],
    solution:
      "Define eligible reads: for example, valid requests for a note owned by the signed-in caller. Choose a window, such as seven days, and define where request timing begins and ends. Example targets: at least 99.9% of eligible reads succeed, and at least 95% of those reads finish within 300 ms. Count timeouts and server errors explicitly. These are sample targets, not measurements of this app. Inspect slower percentiles and individual slow requests as well.",
    diagram: ["Request timing", "Latency distribution", "Target + error rate"],
    sources: ["slo"],
    terms: [
      ["Latency", "How long one request takes."],
      ["Throughput", "Completed work per unit of time."],
      ["SLO", "A stated target for a user-visible service measure."],
    ],
    scenario: "Twenty note reads are timed. Nineteen take 100 ms each; one takes 2,000 ms.",
    frames: [
      {
        action: "Sort the twenty timings.",
        facts: [
          ["Positions 1–19", "100 ms each"],
          ["Position 20", "2,000 ms"],
        ],
        why: "A sorted list makes the slow request visible.",
        focus: 0,
      },
      {
        action: "Calculate p95 using the nearest-rank rule.",
        facts: [
          ["Position", "ceil(0.95 × 20) = 19"],
          ["p95", "100 ms"],
        ],
        why: "p95 can still hide the slowest 5%. It does not mean every request is fast.",
        focus: 1,
      },
      {
        action: "Inspect the tail as well as p95.",
        facts: [
          ["Slowest request", "2,000 ms"],
          ["Fraction at 100 ms", "19/20 = 95%"],
        ],
        why: "In this small sample, the one slow request matters even though p95 looks good.",
        focus: 1,
      },
      {
        action: "Keep volume and failures separate.",
        facts: [
          ["If all 20 finish in 10 seconds", "Throughput over that interval: 2 reads/second"],
          ["Success rate if all succeed", "20/20 = 100%"],
        ],
        why: "Duration, completed rate, and success rate answer different questions.",
        focus: 2,
      },
    ],
    solutionSteps: [
      "Define eligible reads: for example, valid requests for a note owned by the signed-in caller.",
      "Choose a window, such as seven days, and define where request timing begins and ends.",
      "Example targets: at least 99.9% of eligible reads succeed, and at least 95% of those reads finish within 300 ms. Count timeouts and server errors explicitly.",
      "These are sample targets, not measurements of this app. Inspect slower percentiles and individual slow requests as well.",
    ],
    concepts: ["estimates"],
  },
  {
    id: "scale",
    stage: 1,
    title: "Add servers without losing a person’s place",
    idea: "Any application server should be able to handle the next request.",
    explain: [
      "A load balancer receives requests and sends them to application servers. Adding servers can help when the application is the part running out of capacity.",
      "Suppose Server A keeps a note only in its own memory. If the next request goes to Server B, B will not have that note.",
      "Keep saved notes in shared durable storage. Either application server should be able to verify a sign-in session and read the allowed records.",
      "Check which servers are healthy before routing new work to them. More application servers will not fix an already overloaded database.",
    ],
    walk: [
      "Route the first request to Server A.",
      "A reads the shared database after checking permission.",
      "Route a later request to Server B.",
      "A fails a health check.",
    ],
    pitfall: "Adding application servers does not make a database faster when it is already at its limit.",
    check: {
      prompt: "A note is stored only in server A’s memory. The next request goes to B. What is wrong?",
      options: ["B may not have the note", "The database has too many copies", "Load balancing guarantees the note appears"],
      answer: 0,
      why: [
        "Yes. Share durable state outside individual application processes.",
        "The example has not stored the note in the database at all.",
        "Routing does not replicate application memory.",
      ],
    },
    task: "Draw a two-server notes service. Show where sign-in is verified, where notes live, and what happens if one server stops.",
    rubric: ["Both servers use shared durable state.", "Either server can verify a session.", "I considered health checks and in-flight failure."],
    solution:
      "Use browser → load balancer → either application server → shared database. Both application servers verify the caller and enforce record ownership. Remove unhealthy servers from new-request routing. Keep saved data outside individual app processes. Plan safe retries for interrupted requests. Separately examine database and load-balancer failure and capacity limits.",
    diagram: ["Load balancer", "Server A or B", "Shared database"],
    sources: ["roadmap", "patterns"],
    lab: "capacity",
    terms: [
      ["Load balancer", "A component that directs incoming requests to available servers."],
      ["Bottleneck", "The part currently limiting the useful work the system can do."],
      ["Health check", "A check used to decide whether a server should receive work."],
    ],
    scenario: "Student 7 has a saved note. Two application servers share one database.",
    frames: [
      {
        action: "Route the first request to Server A.",
        facts: [
          ["Selected application", "Server A"],
          ["Requested record", "Student 7’s saved note"],
        ],
        why: "The load balancer chooses a server; it does not itself copy the note.",
        focus: 0,
      },
      {
        action: "A reads the shared database after checking permission.",
        facts: [
          ["Durable note text", "Check the edge cases"],
          ["Saved location", "Shared database"],
        ],
        why: "Another application server can read the same durable record.",
        focus: 2,
      },
      {
        action: "Route a later request to Server B.",
        facts: [
          ["Selected application", "Server B"],
          ["Returned note", "Check the edge cases"],
        ],
        why: "B can verify the same account and use the shared storage.",
        focus: 1,
      },
      {
        action: "A fails a health check.",
        facts: [
          ["New requests", "Route to healthy Server B"],
          ["Saved note", "Still in the database"],
        ],
        why: "Requests already in flight may have uncertain outcomes. The retry lesson explains how to handle them.",
        focus: 0,
      },
    ],
    solutionSteps: [
      "Use browser → load balancer → either application server → shared database.",
      "Both application servers verify the caller and enforce record ownership.",
      "Remove unhealthy servers from new-request routing. Keep saved data outside individual app processes.",
      "Plan safe retries for interrupted requests. Separately examine database and load-balancer failure and capacity limits.",
    ],
    concepts: ["authorization", "metrics"],
  },
  {
    id: "cache",
    stage: 1,
    title: "Keep a nearby copy of repeated reads",
    idea: "A cache saves work by reusing an answer you already fetched.",
    explain: [
      "A cache keeps a reusable copy of an answer. If many students open the same public lesson, the app can reuse that copy instead of loading the lesson from the source every time.",
      "Finding the copy is a cache hit. Not finding it is a miss. On a miss, this example reads the source, fills the cache, and returns the answer.",
      "A cached copy can become old. Decide when it expires or how to remove it after an update. Removing an old copy is called invalidation.",
      "A versioned key helps only if new readers discover and request the new version. Keep a durable source, and check access before returning private cached data.",
    ],
    walk: [
      "Look for version 3 in the cache.",
      "Fetch the source and fill the cache.",
      "Another reader asks for the same version.",
      "Publish version 4 and update the page’s version reference.",
    ],
    pitfall: "A shared cache key such as ‘my-notes’ can leak one learner’s notes to another.",
    check: {
      prompt: "1,000 requests arrive. A 90% hit rate means how many misses?",
      options: ["900", "100", "10"],
      answer: 1,
      why: ["900 are hits, not misses.", "Yes. Ten percent of 1,000 requests miss the cache.", "Ten percent means 100 out of 1,000."],
    },
    task: "Choose what to cache in a notes app: public lesson text or a private ‘my notes’ response. Describe the key, expiry, and stale-data risk.",
    rubric: ["I specified a cache key and access scope.", "I explained expiry or invalidation.", "I kept a durable source of truth."],
    solution:
      "Start with public lesson text, which many people can safely share. Use a versioned lesson key and keep the original content in durable storage. When publishing a new lesson version, update the page or manifest that tells readers which version to request. For private notes, use account-scoped keys, enforce permission, and define how quickly edits must become visible. A shared “my-notes” key is unsafe.",
    diagram: ["Read", "Cache hit?", "Source on a miss"],
    sources: ["cache"],
    lab: "cache",
    terms: [
      ["Cache key", "The name used to find a cached value."],
      ["TTL", "Time to live: how long a copy may be reused."],
      ["Invalidation", "Removing or replacing a cached copy when it is no longer suitable."],
    ],
    scenario: "A public lesson uses cache key lesson:42:v3. The source contains version 3. The cache starts empty.",
    frames: [
      {
        action: "Look for version 3 in the cache.",
        facts: [
          ["Key requested", "lesson:42:v3"],
          ["Cache result", "Miss: no stored copy"],
        ],
        why: "The app still needs the lesson, so it must read the source.",
        focus: 1,
      },
      {
        action: "Fetch the source and fill the cache.",
        facts: [
          ["Source returned", "Lesson 42, version 3"],
          ["New cache entry", "lesson:42:v3 → lesson text"],
        ],
        why: "The cache now has a reusable answer. The source remains authoritative.",
        focus: 2,
      },
      {
        action: "Another reader asks for the same version.",
        facts: [
          ["Key requested", "lesson:42:v3"],
          ["Cache result", "Hit: return version 3"],
        ],
        why: "In this example, the second read avoids a source lookup.",
        focus: 1,
      },
      {
        action: "Publish version 4 and update the page’s version reference.",
        facts: [
          ["New page requests", "lesson:42:v4"],
          ["Old key", "May remain until expiry"],
        ],
        why: "The new key is useful because the page actually requests it. Changing a key unseen by readers would not update their requests.",
        focus: 0,
      },
    ],
    solutionSteps: [
      "Start with public lesson text, which many people can safely share.",
      "Use a versioned lesson key and keep the original content in durable storage.",
      "When publishing a new lesson version, update the page or manifest that tells readers which version to request.",
      "For private notes, use account-scoped keys, enforce permission, and define how quickly edits must become visible. A shared “my-notes” key is unsafe.",
    ],
    concepts: ["authorization", "scale"],
  },
  {
    id: "cdn",
    stage: 1,
    title: "Deliver large files from nearer the reader",
    idea: "A CDN keeps reusable content at locations closer to users.",
    explain: [
      "A content delivery network, or CDN, can keep public files at locations nearer to readers. That can reduce travel time and the work sent to your original file server.",
      "Object storage keeps file bytes under names called object keys. The database can hold smaller details, such as who owns the file and which key identifies it.",
      "For public lesson images, use versioned URLs and make the page request the new URL after an update.",
      "Private attachments need permission checks. A temporary download link grants access to whoever holds it until its applicable limits expire. Do not treat it as a public permanent file address.",
    ],
    walk: [
      "Publish the original file.",
      "A nearby CDN location has no copy yet.",
      "A later reader requests the same file.",
      "Update both the file version and the page reference.",
    ],
    pitfall: "Long cache lifetimes on a filename that never changes can leave learners seeing old content.",
    check: {
      prompt: "A public illustration changes. Which plan makes the new version easy to cache safely?",
      options: ["Keep an eternal cached URL and hope", "Put all images in every database row", "Publish a new versioned URL"],
      answer: 2,
      why: [
        "Clients may keep the previous file until it expires.",
        "Duplicating file bytes into unrelated records creates other problems.",
        "Yes. A new content version can use a new cache key or URL.",
      ],
    },
    task: "Describe storage and delivery for public lesson diagrams and private student attachments. Explain the access difference.",
    rubric: ["I separated file bytes from metadata.", "I distinguished public and private content.", "I included a cache update plan."],
    solution:
      "Store public illustration bytes and private attachment bytes with deliberate access rules; keep their metadata separately. Serve public diagrams with versioned URLs through a CDN if that helps the workload. When a public diagram changes, update the page to request its new versioned URL. For private attachments, verify permission before issuing a narrowly scoped temporary download link and use an appropriate cache policy.",
    diagram: ["Reader", "Nearby CDN copy", "File origin"],
    sources: ["cache", "security", "uploads"],
    terms: [
      ["CDN", "A network of locations that can serve copies of content."],
      ["Origin", "The source from which a CDN gets the content."],
      ["Metadata", "Details about a file, such as its owner or storage key."],
    ],
    scenario: "A public lesson uses diagram-v3.png. A reader is far from the file’s original storage location.",
    frames: [
      {
        action: "Publish the original file.",
        facts: [
          ["Object key", "public/diagram-v3.png"],
          ["Access rule", "Public lesson illustration"],
        ],
        why: "This is the file source. Ownership details can be kept separately.",
        focus: 2,
      },
      {
        action: "A nearby CDN location has no copy yet.",
        facts: [
          ["Request", "diagram-v3.png"],
          ["Result", "Fetch from origin and store a reusable copy"],
        ],
        why: "The first request may still need the origin. A nearby copy does not appear for free.",
        focus: 1,
      },
      {
        action: "A later reader requests the same file.",
        facts: [
          ["Nearby cached copy", "Version 3"],
          ["Origin fetch for this hit", "Not needed"],
        ],
        why: "The CDN can reuse the public copy according to its caching rules.",
        focus: 1,
      },
      {
        action: "Update both the file version and the page reference.",
        facts: [
          ["New file", "diagram-v4.png"],
          ["New page URL", "Points to diagram-v4.png"],
        ],
        why: "The reader must request the new URL. Old pages can continue using the old file until they update.",
        focus: 0,
      },
    ],
    solutionSteps: [
      "Store public illustration bytes and private attachment bytes with deliberate access rules; keep their metadata separately.",
      "Serve public diagrams with versioned URLs through a CDN if that helps the workload.",
      "When a public diagram changes, update the page to request its new versioned URL.",
      "For private attachments, verify permission before issuing a narrowly scoped temporary download link and use an appropriate cache policy.",
    ],
    concepts: ["cache", "authorization"],
  },
  {
    id: "retry",
    stage: 2,
    title: "A lost reply does not mean nothing happened",
    idea: "Retry safely by recognizing the same operation when it arrives again.",
    explain: [
      "A booking can be saved even when the phone never receives the reply. A timeout means the phone stopped waiting. It does not prove that the booking failed.",
      "Give one intended booking a stable operation key. If the phone retries, send the same key again. The server can recognize the earlier operation and return its saved result.",
      "Store the key and booking outcome together. Enforce uniqueness for the caller and key so two simultaneous copies cannot both create a booking.",
      "Do not retry endlessly. Set a deadline, limit attempts, and wait longer between attempts. Add a small random difference to those waits so many clients do not retry together.",
    ],
    walk: [
      "Send the first request with a stable key.",
      "Save the booking and key outcome together.",
      "The response is lost; retry the same operation.",
      "Return the saved result without creating another booking.",
    ],
    pitfall: "Generating a new key on every retry turns retries into new operations.",
    check: {
      prompt: "A booking reply times out. Which statement is safe?",
      options: ["The outcome is unknown; retry with the same operation key", "The booking definitely failed", "Repeat forever with a new key"],
      answer: 0,
      why: [
        "Yes. A timeout limits waiting; it does not prove the server made no change.",
        "The server may have committed before the reply was lost.",
        "This can create duplicates and amplify overload.",
      ],
    },
    task: "Write a retry contract for creating a reservation. Include key scope, duplicate behavior, and when to stop retrying.",
    rubric: [
      "One operation keeps the same key.",
      "Deduplication and the effect are coordinated durably.",
      "I bounded retries and handled unknown outcomes.",
    ],
    solution:
      "Give the authenticated caller one stable key per intended booking. Reuse it on retries. Enforce uniqueness on caller plus key. Store the request details and outcome with the booking in the same transaction. A matching retry returns the saved result. Reusing the key with different details is an error. Document key retention. Use a retry deadline, bounded attempts, increasing waits, and jitter. If retries stop without a clear result, look up the operation outcome.",
    diagram: ["One operation key", "Durable duplicate check", "Original result"],
    sources: ["idempotency", "retries"],
    terms: [
      ["Idempotency", "Repeating one operation does not repeat its intended effect."],
      ["Backoff", "Waiting longer before another retry."],
      ["Jitter", "A random difference added to retry timing."],
    ],
    scenario: "Student 7 creates a reservation using operation key booking-123. Assume the server retains that key throughout these retries.",
    frames: [
      {
        action: "Send the first request with a stable key.",
        facts: [
          ["Caller + key", "Student 7 + booking-123"],
          ["Requested group", "42"],
        ],
        why: "Keep the key for this intended operation. A new intended booking uses a new key.",
        focus: 0,
      },
      {
        action: "Save the booking and key outcome together.",
        facts: [
          ["Reservation", "83, confirmed"],
          ["Saved key outcome", "booking-123 → reservation 83"],
        ],
        why: "A uniqueness rule and transaction prevent two copies from creating two reservations.",
        focus: 1,
      },
      {
        action: "The response is lost; retry the same operation.",
        facts: [
          ["Phone knows", "No reply received"],
          ["Retry key", "booking-123 again"],
        ],
        why: "The phone is uncertain. It must not conclude that nothing happened.",
        focus: 0,
      },
      {
        action: "Return the saved result without creating another booking.",
        facts: [
          ["Returned reservation", "83, confirmed"],
          ["Total reservations from this operation", "1"],
        ],
        why: "Reject the same key with different request data. Document how long the server remembers keys.",
        focus: 2,
      },
    ],
    solutionSteps: [
      "Give the authenticated caller one stable key per intended booking. Reuse it on retries.",
      "Enforce uniqueness on caller plus key. Store the request details and outcome with the booking in the same transaction.",
      "A matching retry returns the saved result. Reusing the key with different details is an error.",
      "Document key retention. Use a retry deadline, bounded attempts, increasing waits, and jitter. If retries stop without a clear result, look up the operation outcome.",
    ],
    concepts: ["transactions", "api"],
  },
  {
    id: "queues",
    stage: 2,
    title: "Let slow work happen after the reply",
    idea: "A queue holds work until a worker is ready to do it.",
    explain: [
      "Some work can finish after the user gets a reply. For example, a confirmed booking should not have to wait for an email service.",
      "A queue holds jobs. A worker takes a job, does it, and acknowledges completion. That acknowledgement tells the queue the job no longer needs delivery.",
      "Save an outbox record in the same transaction as the booking. This record means “this saved booking still needs a notification job.” Another process copies it to the queue.",
      "Jobs can arrive more than once. Plan safe repeated processing. A queue can absorb a short burst, but a backlog keeps growing when work arrives faster than workers finish it.",
    ],
    walk: [
      "Save the reservation and outbox event together.",
      "Publish event-83 to a durable queue.",
      "The provider accepts the email, then the worker crashes before acknowledgement.",
      "Process the redelivered job with the same notification key.",
    ],
    pitfall: "‘Put it on a queue’ does not guarantee exactly one email or that a backlog will ever drain.",
    check: {
      prompt: "Jobs arrive at 10/second, but workers finish 6/second. What happens under sustained load?",
      options: ["The queue automatically becomes faster", "The backlog grows by about 4 jobs/second", "The backlog stays empty"],
      answer: 1,
      why: [
        "A queue stores excess work; it does not create processing capacity.",
        "Yes. More work arrives than leaves.",
        "Workers cannot keep up in this example.",
      ],
    },
    task: "Design a reliable booking confirmation flow. Include the gap between database commit and queue publish, worker crashes, and duplicate delivery.",
    rubric: ["I handled the database-to-queue gap.", "I considered duplicate effects.", "I track backlog or oldest-job age."],
    solution:
      "Save the confirmed booking and notification outbox record in one transaction. Publish the outbox event to a durable queue and retry publication safely. Monitor events that stay unpublished. Workers use a stable event-recipient-channel key and provider-supported idempotency when available. Record completion before acknowledging the queue job. Bound retries and inspect persistent failures. Track oldest-job age. If the provider cannot prevent repeated effects, state the remaining duplicate-email risk explicitly.",
    diagram: ["Booking + outbox", "Queue", "Notification worker"],
    sources: ["queues", "idempotency", "patterns", "outbox"],
    lab: "queue",
    terms: [
      ["Outbox", "A database record of work to publish, saved with the business change."],
      ["Worker", "A program that performs background jobs."],
      ["Acknowledgement", "A message telling the queue that a job is finished."],
      ["Backlog", "Work still waiting to be processed."],
    ],
    scenario:
      "Reservation 83 needs one email. For this example, the email provider supports repeated sends with the same operation key without a second send.",
    frames: [
      {
        action: "Save the reservation and outbox event together.",
        facts: [
          ["Reservation", "83, confirmed"],
          ["Outbox", "event-83, waiting to publish"],
        ],
        why: "Both commit together. A crash after commit leaves a record from which publishing can resume.",
        focus: 0,
      },
      {
        action: "Publish event-83 to a durable queue.",
        facts: [
          ["Queued work", "Notify the owner of Reservation 83"],
          ["Notification key", "event-83 + recipient + email"],
        ],
        why: "Publishing can also repeat after a crash. The stable event ID helps identify duplicates.",
        focus: 1,
      },
      {
        action: "The provider accepts the email, then the worker crashes before acknowledgement.",
        facts: [
          ["Provider result", "Email accepted under the notification key"],
          ["Queue knows completion", "No"],
        ],
        why: "The queue may deliver the job again because it has not received completion.",
        focus: 2,
      },
      {
        action: "Process the redelivered job with the same notification key.",
        facts: [
          ["Provider action in this example", "Return the previous result; no second send"],
          ["Then", "Record completion and acknowledge"],
        ],
        why: "Without provider support or another suitable coordination mechanism, an external email can still be duplicated.",
        focus: 2,
      },
    ],
    solutionSteps: [
      "Save the confirmed booking and notification outbox record in one transaction.",
      "Publish the outbox event to a durable queue and retry publication safely. Monitor events that stay unpublished.",
      "Workers use a stable event-recipient-channel key and provider-supported idempotency when available. Record completion before acknowledging the queue job.",
      "Bound retries and inspect persistent failures. Track oldest-job age. If the provider cannot prevent repeated effects, state the remaining duplicate-email risk explicitly.",
    ],
    concepts: ["retry", "transactions"],
  },
  {
    id: "replication",
    stage: 2,
    title: "Make a copy, then ask how current it is",
    idea: "Replication keeps copies of data on different servers.",
    explain: [
      "Replication keeps copies of data on different database servers. In this example, one primary accepts writes and a replica copies them.",
      "With asynchronous replication, the primary can reply before the replica receives the change. A read from that replica may therefore return an older value.",
      "Waiting for another copy can improve the write’s durability guarantee, depending on exactly what acknowledgement is required. It also adds waiting and may block when that copy is unreachable.",
      "Keep backups too. A replica normally copies an accidental deletion; it is not automatically a history from which you can restore the old row.",
    ],
    walk: [
      "Write version 8 to the primary.",
      "The primary replies before the copy catches up.",
      "A read goes to the lagging replica.",
      "The replica receives and applies version 8.",
    ],
    pitfall: "A replica is not a backup history and is not automatically up to date.",
    check: {
      prompt: "You delete a row accidentally, and that delete is replicated. What would help recover the old row?",
      options: ["A suitable tested backup and recovery history", "Assuming every replica kept the old row", "Adding a load balancer"],
      answer: 0,
      why: [
        "Yes. Recovery needs retained history, not just live copies.",
        "Replicas normally apply deletions too.",
        "Traffic routing does not recover deleted data.",
      ],
    },
    task: "Choose a read plan for public lesson descriptions and freshly saved private notes. Explain replica lag and recovery.",
    rubric: ["I considered stale reads.", "I distinguished replication and backups.", "I stated a failover durability limitation."],
    solution:
      "Public lesson descriptions may tolerate a brief stale read from a replica. After saving a private note, read from a source that guarantees that write is visible, or wait for the replica to reach a known version. State what an asynchronous failover could lose before the copy catches up. Maintain backup history and test restoration. A replica that also received an accidental deletion will not by itself recover the old row.",
    diagram: ["Write to primary", "Copy changes", "Read replica"],
    sources: ["replication"],
    terms: [
      ["Primary", "The database accepting writes in this example."],
      ["Replica", "A server that keeps a copy of database changes."],
      ["Lag", "How far a copy is behind the source."],
      ["Failover", "Switching to a replacement after a failure."],
    ],
    scenario: "Both database servers hold Note 42 at version 7. The primary uses asynchronous replication.",
    frames: [
      {
        action: "Write version 8 to the primary.",
        facts: [
          ["Primary version", "8"],
          ["Replica version", "7"],
        ],
        why: "The change has not reached the replica yet.",
        focus: 0,
      },
      {
        action: "The primary replies before the copy catches up.",
        facts: [
          ["User sees", "Save succeeded"],
          ["Replica version", "Still 7"],
        ],
        why: "Asynchronous replication allows this gap. A success reply does not make every copy current.",
        focus: 1,
      },
      {
        action: "A read goes to the lagging replica.",
        facts: [
          ["Read source", "Replica"],
          ["Returned version", "7"],
        ],
        why: "A learner can see old data immediately after a successful save if the read path ignores lag.",
        focus: 2,
      },
      {
        action: "The replica receives and applies version 8.",
        facts: [
          ["Primary version", "8"],
          ["Replica version", "8"],
        ],
        why: "Future reads of this record can now see version 8. A primary failure before this step could lose that recent change on failover.",
        focus: 1,
      },
    ],
    solutionSteps: [
      "Public lesson descriptions may tolerate a brief stale read from a replica.",
      "After saving a private note, read from a source that guarantees that write is visible, or wait for the replica to reach a known version.",
      "State what an asynchronous failover could lose before the copy catches up.",
      "Maintain backup history and test restoration. A replica that also received an accidental deletion will not by itself recover the old row.",
    ],
    concepts: ["transactions", "scale"],
  },
  {
    id: "consistency",
    stage: 2,
    title: "Decide when an older answer is acceptable",
    idea: "Different operations can need different promises about freshness.",
    explain: [
      "Freshness needs depend on the action. A public like count may be a little old. A learner reading the note they just saved usually expects to see their own change.",
      "A read-your-writes promise means that a person’s later reads include their own earlier completed write.",
      "Eventual consistency means copies converge when updates stop and the system can successfully exchange and apply changes. That phrase alone does not promise a one-second delay.",
      "Seat claims need a coordinated correctness rule, not a guess from a stale count. Choose a promise for each operation and explain why it fits.",
    ],
    walk: [
      "One new like reaches the writer.",
      "A reader asks the nearby copy.",
      "The nearby copy applies the change.",
      "Compare with a final seat claim.",
    ],
    pitfall: "A transaction’s correctness rules and the freshness of a copied value are different questions.",
    check: {
      prompt: "Which operation most needs a coordinated correctness decision?",
      options: ["Displaying a slightly old public like count", "Claiming the final seat", "Showing a cached lesson illustration"],
      answer: 1,
      why: [
        "This can often tolerate delay.",
        "Yes. Two independent stale checks can oversell the seat.",
        "A versioned illustration can often tolerate caching.",
      ],
    },
    task: "For a study app, label a public count, a saved note, and a seat claim with the freshness or correctness promise each needs.",
    rubric: ["I chose promises per operation.", "I explained why one may tolerate delay.", "I used coordination where correctness requires it."],
    solution:
      "Allow the public view count to catch up later if that fits the product. For saved private notes, specify how a learner reads their own completed save. For seats, enforce capacity through a coordinated database operation. If the product needs a maximum freshness delay, state and measure a separate target. The word “eventual” does not provide that time bound.",
    diagram: ["Write", "Copies catch up", "Promise per operation"],
    sources: ["consistency", "replication"],
    terms: [
      ["Stale read", "A read returning an older value."],
      ["Read your writes", "Your later reads include the change you already saved."],
      ["Converge", "Reach the same value after outstanding changes are applied."],
    ],
    scenario: "A public lesson has 99 likes. This product allows a short delay before all readers see a new like.",
    frames: [
      {
        action: "One new like reaches the writer.",
        facts: [
          ["Writer’s count", "100"],
          ["Nearby copy’s count", "99"],
        ],
        why: "A new change has not reached every copy yet.",
        focus: 0,
      },
      {
        action: "A reader asks the nearby copy.",
        facts: [
          ["Displayed count", "99"],
          ["Product rule", "A brief stale public count is acceptable"],
        ],
        why: "This decision depends on what the product allows, not on a universal rule for all records.",
        focus: 1,
      },
      {
        action: "The nearby copy applies the change.",
        facts: [
          ["Writer’s count", "100"],
          ["Nearby copy’s count", "100"],
        ],
        why: "The copies agree once the pending update is delivered and applied.",
        focus: 1,
      },
      {
        action: "Compare with a final seat claim.",
        facts: [
          ["Display count", "May be an old hint"],
          ["Confirmation decision", "Must use the coordinated seat rule"],
        ],
        why: "A stale public count is not a safe authority for promising the last seat.",
        focus: 2,
      },
    ],
    solutionSteps: [
      "Allow the public view count to catch up later if that fits the product.",
      "For saved private notes, specify how a learner reads their own completed save.",
      "For seats, enforce capacity through a coordinated database operation.",
      "If the product needs a maximum freshness delay, state and measure a separate target. The word “eventual” does not provide that time bound.",
    ],
    concepts: ["replication", "transactions"],
  },
  {
    id: "partitions",
    stage: 2,
    title: "What if two sides cannot talk?",
    idea: "When copies lose contact, some guarantees cannot all be kept.",
    explain: [
      "A network partition happens when parts of a system cannot exchange needed messages. Both sides may still receive requests from people.",
      "CAP describes a limit for shared data during such a split. You cannot guarantee that all operations behave like one up-to-date copy while also guaranteeing that every request to a nonfailed node completes its operation.",
      "To keep a coordinated seat rule, a side unable to confirm its authority may have to refuse or delay a booking. Returning an error is useful behavior, but it does not make that booking operation available in the CAP sense.",
      "This is a decision for a particular operation during a communication failure. “Pick any two” is too vague to guide the whole design.",
    ],
    walk: [
      "The communication link fails.",
      "A receives and confirms a valid claim.",
      "B receives another request but has only the old count.",
      "B refuses an uncertain confirmation.",
    ],
    pitfall: "A timeout does not reveal whether the other side is dead or merely unreachable.",
    check: {
      prompt: "During a split, two isolated nodes both confirm the same last seat. Which promise was broken?",
      options: ["The ability to render HTML", "The ability to cache images", "The single-seat correctness rule"],
      answer: 2,
      why: [
        "Rendering is unrelated to this conflict.",
        "Image caching does not enforce seat ownership.",
        "Yes. Keeping both sides accepting independent claims can violate the rule.",
      ],
    },
    task: "Explain what your booking service shows when it cannot reach the authority for the last seat. Compare that with a public view counter.",
    rubric: ["I described an actual communication failure.", "I kept the seat rule explicit.", "I explained the availability trade-off."],
    solution:
      "Name the authority responsible for a seat claim. If a location cannot establish that authority, return a clear “cannot confirm yet” result rather than a false success. A public counter can use a different plan, accepting local changes and later merging them with a rule that avoids lost or duplicated increments. Explain the cost: one booking path is unavailable during the split. Reconciliation also needs a design; it is not automatic.",
    diagram: ["Location A", "Network link broken", "Location B"],
    sources: ["cap", "consistency", "capExplanation"],
    terms: [
      ["Network partition", "Parts of a system cannot communicate with one another."],
      ["CAP consistency", "Reads and writes behave as if there were one up-to-date copy."],
      ["CAP availability", "Every request to a nonfailed node eventually completes its operation, rather than being refused because of the split."],
    ],
    scenario: "A booking authority is in Location A. Location B cannot reach it. One seat was free before the network split.",
    frames: [
      {
        action: "The communication link fails.",
        facts: [
          ["Location A", "Can reach the seat authority"],
          ["Location B", "Cannot reach the seat authority"],
        ],
        why: "A timeout cannot tell B whether A stopped or the link is merely broken.",
        focus: 1,
      },
      {
        action: "A receives and confirms a valid claim.",
        facts: [
          ["Confirmed owner", "Student A"],
          ["Seats left at the authority", "0"],
        ],
        why: "A uses the coordinated seat rule, not a remembered count.",
        focus: 0,
      },
      {
        action: "B receives another request but has only the old count.",
        facts: [
          ["B’s remembered count", "1"],
          ["B can confirm current authority", "No"],
        ],
        why: "An old “one seat left” value cannot prove that the seat is still free.",
        focus: 2,
      },
      {
        action: "B refuses an uncertain confirmation.",
        facts: [
          ["B’s response", "Cannot confirm now; retry later"],
          ["Total confirmed owners", "1"],
        ],
        why: "This choice protects the seat rule but sacrifices the ability to complete this booking on B during the split.",
        focus: 2,
      },
    ],
    solutionSteps: [
      "Name the authority responsible for a seat claim.",
      "If a location cannot establish that authority, return a clear “cannot confirm yet” result rather than a false success.",
      "A public counter can use a different plan, accepting local changes and later merging them with a rule that avoids lost or duplicated increments.",
      "Explain the cost: one booking path is unavailable during the split. Reconciliation also needs a design; it is not automatic.",
    ],
    concepts: ["consistency", "replication"],
  },
  {
    id: "sharding",
    stage: 2,
    title: "Split data only when you know the pressure",
    idea: "Sharding puts different records on different storage nodes.",
    explain: [
      "Replication makes copies of the same data. Sharding divides different records between storage nodes.",
      "A shard key decides which records belong together. If notes are grouped by student ID, most reads of one student’s notes can go to one shard.",
      "A good key must spread work as well as data. One extremely busy student can still overload their shard.",
      "Queries across students and moves between shards need extra coordination. Improve measured queries and capacity before adding sharding just because a design looks large.",
    ],
    walk: [
      "Choose a key around a common query.",
      "Read Student 7’s routing entry.",
      "Send Student 7’s note read to Shard B.",
      "Consider a query spanning all students.",
    ],
    pitfall: "A balanced number of rows does not guarantee balanced traffic.",
    check: {
      prompt: "One celebrity’s account receives half of all reads. What can still happen after sharding by user?",
      options: ["That user’s shard can become hot", "Traffic must be perfectly balanced", "Replication and sharding become identical"],
      answer: 0,
      why: [
        "Yes. Placement must consider workload, not just record counts.",
        "One busy key can dominate a shard.",
        "Copies and partitions solve different problems.",
      ],
    },
    task: "Suggest a key for private notes. Explain one query it makes easy and one query it makes harder. State what would justify sharding.",
    rubric: ["I stated a key and access pattern.", "I considered a hot key or cross-shard operation.", "I named evidence needed before sharding."],
    solution:
      "Consider student_id for private notes so one student’s ordinary reads stay together. Explain how the application locates the owning shard. A cross-student query may need multiple shards. A very busy student may still cause a hot shard. Require evidence of remaining database limits after query, index, and capacity improvements. Plan routing changes and data movement before actually sharding.",
    diagram: ["Routing by key", "Shard A: some records", "Shard B: other records"],
    sources: ["patterns", "roadmap"],
    terms: [
      ["Shard", "One part of a divided dataset."],
      ["Shard key", "The field used to decide where a record belongs."],
      ["Hot key", "One key that receives enough work to overload its location."],
    ],
    scenario: "The routing table assigns Student 7 to Shard B and Student 8 to Shard A. This example keeps those assignments fixed.",
    frames: [
      {
        action: "Choose a key around a common query.",
        facts: [
          ["Key", "student_id"],
          ["Common query", "All notes for one student"],
        ],
        why: "Keeping a student’s notes together can avoid querying every shard.",
        focus: 0,
      },
      {
        action: "Read Student 7’s routing entry.",
        facts: [
          ["Student 7", "Shard B"],
          ["Student 8", "Shard A"],
        ],
        why: "A routing rule tells the application which shard owns each record.",
        focus: 0,
      },
      {
        action: "Send Student 7’s note read to Shard B.",
        facts: [
          ["Shards contacted for this read", "B only"],
          ["Ownership check", "Still required"],
        ],
        why: "Sharding changes placement, not who is allowed to access the note.",
        focus: 2,
      },
      {
        action: "Consider a query spanning all students.",
        facts: [
          ["Potential shards contacted", "A and B"],
          ["New difficulty", "Combine results and enforce access correctly"],
        ],
        why: "A useful key makes some operations easier while making others harder.",
        focus: 1,
      },
    ],
    solutionSteps: [
      "Consider student_id for private notes so one student’s ordinary reads stay together.",
      "Explain how the application locates the owning shard.",
      "A cross-student query may need multiple shards. A very busy student may still cause a hot shard.",
      "Require evidence of remaining database limits after query, index, and capacity improvements. Plan routing changes and data movement before actually sharding.",
    ],
    concepts: ["indexes", "replication"],
  },
  {
    id: "limits",
    stage: 3,
    title: "Protect a service from too much work",
    idea: "A rate limit bounds how much work a caller can start in a period.",
    explain: [
      "A rate limit bounds how much work a caller can start. It can protect an expensive operation from a sudden rush or one overactive account.",
      "A token bucket is one approach. It has a maximum token count, refills over time, and spends a token for each allowed request.",
      "The bucket size allows a burst. The refill rate controls the longer-term pace. Those are different settings.",
      "If several servers enforce one shared limit, their updates need a coordinated plan. Use a suitable caller key and explain what the user sees when a request is refused.",
    ],
    walk: [
      "Begin with a full bucket.",
      "Allow five immediate requests.",
      "Refuse the sixth immediate request.",
      "Wait one second with no intervening requests.",
    ],
    pitfall: "Five servers each allowing 10 requests per second may together allow 50. That does not enforce a shared limit of 10.",
    check: {
      prompt: "A full 5-token bucket refills at 1/second. Six requests arrive at once. How many can immediately pass?",
      options: ["6", "5", "1"],
      answer: 1,
      why: [
        "Only five tokens are available initially.",
        "Yes. Capacity allows a burst of five; refill matters over time.",
        "One per second is the refill rate, not the initial burst capacity.",
      ],
    },
    task: "Design a limit for creating study groups. Name the key, burst size, refill rate, and what the user sees when limited.",
    rubric: ["I specified a burst and sustained rate.", "I considered multiple app servers.", "I described a useful rejection response."],
    solution:
      "Use a verified account ID for an example study-group creation policy. For illustration, permit a burst of three creations with one token refilled per minute. Choose real limits from legitimate demand and abuse evidence. Coordinate the shared counter across application servers rather than giving each an independent full allowance. Return 429 and useful retry guidance when limited. Monitor rejections and separately protect expensive requests made before sign-in.",
    diagram: ["Caller", "Shared token bucket", "Allow or slow down"],
    sources: ["patterns", "retries", "throttling"],
    terms: [
      ["Token bucket", "A counter that refills over time and spends tokens on allowed work."],
      ["Burst", "Several requests arriving close together."],
      ["429", "The HTTP status for too many requests."],
    ],
    scenario:
      "The bucket starts with 5 tokens, holds at most 5, and refills at 1 token per second. Six requests arrive with no time passing between them.",
    frames: [
      {
        action: "Begin with a full bucket.",
        facts: [
          ["Tokens available", "5"],
          ["Refill rate", "1 token/second"],
        ],
        why: "The bucket capacity is the immediate burst allowance.",
        focus: 1,
      },
      {
        action: "Allow five immediate requests.",
        facts: [
          ["Tokens spent", "5"],
          ["Tokens left", "0"],
        ],
        why: "Each accepted request consumes one token. There has been no time to refill.",
        focus: 2,
      },
      {
        action: "Refuse the sixth immediate request.",
        facts: [
          ["Tokens available", "0"],
          ["Response", "429 with appropriate retry guidance"],
        ],
        why: "The refill rate does not create an extra token before time passes.",
        focus: 2,
      },
      {
        action: "Wait one second with no intervening requests.",
        facts: [
          ["Tokens refilled", "1"],
          ["New request can pass", "Yes, spending that token"],
        ],
        why: "The bucket refills up to its maximum, never beyond it.",
        focus: 1,
      },
    ],
    solutionSteps: [
      "Use a verified account ID for an example study-group creation policy.",
      "For illustration, permit a burst of three creations with one token refilled per minute. Choose real limits from legitimate demand and abuse evidence.",
      "Coordinate the shared counter across application servers rather than giving each an independent full allowance.",
      "Return 429 and useful retry guidance when limited. Monitor rejections and separately protect expensive requests made before sign-in.",
    ],
    concepts: ["authorization", "scale", "retry"],
  },
  {
    id: "operations",
    stage: 3,
    title: "Make a failure explain itself",
    idea: "Good signals help you find which part of a user’s request went wrong.",
    explain: [
      "Start with the action a learner depends on: saving and retrieving a note. A healthy machine is not enough if that action is failing.",
      "Metrics show totals and trends, such as save failures or slow requests. Logs record individual events. A trace connects related work across components.",
      "Attach a request ID so you can follow a failure without logging passwords, sign-in tokens, or private note text.",
      "Alert when user-facing behavior breaks a meaningful target. Test recovery as well: restore a backup somewhere isolated and verify that the expected data and access rules still work.",
    ],
    walk: [
      "Count the user-visible result.",
      "Calculate the failure rate.",
      "Inspect a related failure record.",
      "Verify the user operation after mitigation.",
    ],
    pitfall: "A healthy-looking server chart does not prove that people can save their work.",
    check: {
      prompt: "Which signal most directly tells you users cannot save notes?",
      options: ["The failure rate of eligible save requests", "The color of the server icon", "The number of source files"],
      answer: 0,
      why: [
        "Yes. Measure the operation people depend on.",
        "A visual badge can hide a broken user flow.",
        "Repository size does not measure service health.",
      ],
    },
    task: "Write a tiny operations plan for saved notes: one target, two signals, an alert, and a restore check.",
    rubric: ["I measured a user-visible operation.", "I avoided sensitive log content.", "I included recovery verification."],
    solution:
      "Define the save operation and an example service target over a stated time window. Track save success rate and latency. Use request IDs to investigate failures without logging private note content. Choose an alert policy tied to meaningful user impact and document the first checks during an incident. Test restoring a backup in isolation, including note contents and ownership checks. Record the observed recovery time and any data-loss window.",
    diagram: ["User outcome", "Metrics + logs + traces", "Alert → investigate"],
    sources: ["slo", "replication"],
    terms: [
      ["Metric", "A measured value or count tracked over time."],
      ["Log", "A record of an individual event."],
      ["Trace", "Connected records of the work done for one request."],
    ],
    scenario: "In one measurement interval, 100 eligible note-save requests arrive. Ten fail because the database times out.",
    frames: [
      {
        action: "Count the user-visible result.",
        facts: [
          ["Eligible saves", "100"],
          ["Failed saves", "10"],
        ],
        why: "Measure the save operation people use, not just whether a server is running.",
        focus: 0,
      },
      {
        action: "Calculate the failure rate.",
        facts: [
          ["Calculation", "10 ÷ 100 × 100%"],
          ["Failure rate", "10%"],
        ],
        why: "A defined numerator, denominator, and interval make the signal understandable.",
        focus: 1,
      },
      {
        action: "Inspect a related failure record.",
        facts: [
          ["Request ID", "r42"],
          ["Recorded event", "Database timeout; no private note body"],
        ],
        why: "The identifier connects useful evidence while keeping private content out of logs.",
        focus: 1,
      },
      {
        action: "Verify the user operation after mitigation.",
        facts: [
          ["Check", "Can an authorized learner save and read a test note?"],
          ["Also inspect", "Failure rate and latency returning to normal"],
        ],
        why: "Fixing a machine symptom is not the same as confirming the user flow works again.",
        focus: 2,
      },
    ],
    solutionSteps: [
      "Define the save operation and an example service target over a stated time window.",
      "Track save success rate and latency. Use request IDs to investigate failures without logging private note content.",
      "Choose an alert policy tied to meaningful user impact and document the first checks during an incident.",
      "Test restoring a backup in isolation, including note contents and ownership checks. Record the observed recovery time and any data-loss window.",
    ],
    concepts: ["metrics", "queues", "replication"],
  },
  {
    id: "realtime",
    stage: 3,
    title: "Choose how the browser hears about changes",
    idea: "Pick the simplest update method that meets the freshness need.",
    explain: [
      "Polling asks the server repeatedly whether anything changed. It is often enough for occasional booking updates.",
      "Server-sent events let a server stream updates to a browser. WebSockets support messages in both directions over a connection that stays open.",
      "A connection can disappear. Save important events and remember which ones the browser received so it can recover what it missed.",
      "Define a gap-free handoff between old history and new updates. One option is a server protocol that replays saved events after a resume marker and then continues streaming them in order.",
    ],
    walk: [
      "Open the conversation history.",
      "Receive messages 81 and 82 in order.",
      "Lose the connection before message 83 arrives.",
      "Reconnect and request replay after 82.",
    ],
    pitfall: "A live connection does not save messages for you. Plan what happens when it drops before a message arrives.",
    check: {
      prompt: "A chat socket drops. What helps recover missed messages?",
      options: ["Only the old socket object", "Stored messages plus a resume marker", "Assuming the browser saw everything"],
      answer: 1,
      why: [
        "The disconnected socket cannot replay messages by itself.",
        "Yes. Persist messages and recover after the last acknowledged position.",
        "Network failure can interrupt delivery.",
      ],
    },
    task: "Choose polling, server-sent events, or WebSockets for booking status updates. Explain your freshness need and reconnect plan.",
    rubric: ["The transport fits the actual update need.", "I used durable data for recovery.", "I included subscription authorization."],
    solution:
      "For occasional booking changes, consider polling first and choose an interval that fits the freshness need. If prompt one-way updates are important, consider server-sent events; bidirectional chat may justify WebSockets. On reconnect, read the authoritative booking status. For an event history, use a defined replay and subscription handoff. Authorize both subscription and data access. A connection is a transport, not the durable source of truth.",
    diagram: ["Browser connection", "Update service", "Durable event history"],
    sources: ["http", "patterns", "realtime"],
    terms: [
      ["Polling", "Checking for updates repeatedly."],
      ["WebSocket", "A connection that can carry messages in both directions."],
      ["Resume marker", "An identifier saying where to continue reading saved events."],
    ],
    scenario: "A group stores messages in sequence. The server supports replay after a saved sequence number on reconnect.",
    frames: [
      {
        action: "Open the conversation history.",
        facts: [
          ["Stored messages shown", "Up to sequence 80"],
          ["Browser resume marker", "80"],
        ],
        why: "The marker identifies the last consecutive message received, not merely the largest number ever seen.",
        focus: 0,
      },
      {
        action: "Receive messages 81 and 82 in order.",
        facts: [
          ["Messages added", "81, 82"],
          ["Browser resume marker", "82"],
        ],
        why: "The application updates the marker after accepting the consecutive messages.",
        focus: 1,
      },
      {
        action: "Lose the connection before message 83 arrives.",
        facts: [
          ["Database contains", "Message 83"],
          ["Browser resume marker", "Still 82"],
        ],
        why: "Durable history keeps the missed message available after the connection is gone.",
        focus: 2,
      },
      {
        action: "Reconnect and request replay after 82.",
        facts: [
          ["Replayed message", "83"],
          ["Then", "Continue the ordered live stream"],
        ],
        why: "The server must bridge replay and streaming without a gap. Stable message IDs also let the browser discard repeated deliveries.",
        focus: 1,
      },
    ],
    solutionSteps: [
      "For occasional booking changes, consider polling first and choose an interval that fits the freshness need.",
      "If prompt one-way updates are important, consider server-sent events; bidirectional chat may justify WebSockets.",
      "On reconnect, read the authoritative booking status. For an event history, use a defined replay and subscription handoff.",
      "Authorize both subscription and data access. A connection is a transport, not the durable source of truth.",
    ],
    concepts: ["queues", "authorization", "consistency"],
  },
  {
    id: "boundaries",
    stage: 3,
    title: "Split responsibilities before splitting deployments",
    idea: "Separate services when the benefits justify the extra coordination.",
    explain: [
      "Separate responsibilities in the code before deciding that each one needs its own deployed service.",
      "A modular monolith is one deployable application with clear internal parts. For a small team, that can make changing, testing, and debugging the first version simpler.",
      "Separate services can help when teams need independent ownership or different parts need very different capacity. They also add network failures and more work to coordinate changes.",
      "A notification worker can run separately without making every database table a service. Split further when you can name the benefit and explain the extra failure cases.",
    ],
    walk: [
      "Name responsibilities inside one application.",
      "Keep seat rules and ownership clear.",
      "Move slow email work to a worker if needed.",
      "Define a reason to split further later.",
    ],
    pitfall: "A service per database table can turn a simple update into many fragile network calls.",
    check: {
      prompt: "A small team has little traffic and changes features together. Which is a reasonable starting point?",
      options: ["Fifty services by default", "A separate service for every column", "A well-structured application with clear modules"],
      answer: 2,
      why: [
        "Extra deployments add coordination without a stated benefit.",
        "Columns are not useful default service boundaries.",
        "Yes. Simplicity is a valid design choice under these assumptions.",
      ],
    },
    task: "Choose an initial deployment structure for a two-person booking app. Name one concrete trigger for separating a component later.",
    rubric: [
      "My choice reflects the team and workload.",
      "I kept ownership and responsibilities clear.",
      "I named a measurable or organizational trigger.",
    ],
    solution:
      "Begin with one application containing clear account, booking, and notification modules. Keep the data and seat rules owned by the booking boundary. Use a separate worker if sending notifications should not delay requests. Consider a separate service when measured load, failure isolation, or team ownership needs independent operation. Explain the new network and consistency costs.",
    diagram: ["Clear modules", "One app + useful worker", "Split when justified"],
    sources: ["simplicity"],
    terms: [
      ["Module", "A part of an application with a clear responsibility."],
      ["Deployment", "A running release of software."],
      ["Microservice", "A separately operated service with a bounded responsibility."],
    ],
    scenario: "Two engineers are building a small study-group app. They usually change the features together.",
    frames: [
      {
        action: "Name responsibilities inside one application.",
        facts: [
          ["Modules", "Accounts, booking, notifications"],
          ["Team", "2 engineers"],
        ],
        why: "These code boundaries can be useful before separate network services exist.",
        focus: 0,
      },
      {
        action: "Keep seat rules and ownership clear.",
        facts: [
          ["Owner of seat claim", "Booking module"],
          ["Rule", "Never confirm more seats than exist"],
        ],
        why: "Splitting this rule across loosely coordinated owners would make correctness harder.",
        focus: 1,
      },
      {
        action: "Move slow email work to a worker if needed.",
        facts: [
          ["User-facing action", "Save the booking"],
          ["Background action", "Send the email"],
        ],
        why: "The queue separates waiting time without requiring a service for every feature.",
        focus: 1,
      },
      {
        action: "Define a reason to split further later.",
        facts: [
          ["Possible trigger", "A separate team needs independent notification releases"],
          ["New cost to plan", "Network failure, access control, and data contracts"],
        ],
        why: "A justified boundary is stronger than a rule that every small app must use many services.",
        focus: 2,
      },
    ],
    solutionSteps: [
      "Begin with one application containing clear account, booking, and notification modules.",
      "Keep the data and seat rules owned by the booking boundary.",
      "Use a separate worker if sending notifications should not delay requests.",
      "Consider a separate service when measured load, failure isolation, or team ownership needs independent operation. Explain the new network and consistency costs.",
    ],
    concepts: ["transactions", "queues"],
  },
  {
    id: "search",
    stage: 3,
    title: "Build a view made for finding things",
    idea: "A search index is a derived view, not usually the original record.",
    explain: [
      "Finding a lesson by ID and finding lessons containing “shortest path” are different jobs. A search index can map words to the records that contain them.",
      "The original lesson remains the source of truth. The index is another view built from it, so the index may be behind a recent change.",
      "Decide how edits and deletions reach that view. Keep a way to rebuild it from the source after a failure.",
      "Search results can leak information too. A private title or snippet must not appear just because the full page has an access check.",
    ],
    walk: ["Store the published source records.", "Build a word-to-lesson view.", "Search for “path.”", "Recover after the index is lost."],
    pitfall: "An eventually updated index may still show a deleted or newly private record unless your read path enforces access.",
    check: {
      prompt: "Your search index is lost, but the source lessons remain. What should a good design allow?",
      options: ["Rebuild the index from the source", "Declare all original lessons deleted", "Use search as the only backup"],
      answer: 0,
      why: [
        "Yes. A derived view should have a recovery path.",
        "Losing a copy does not remove intact source records.",
        "An index is not a substitute for source backups.",
      ],
    },
    task: "Design search for public lessons. Explain indexing, update lag, deletion, and rebuilding.",
    rubric: ["I identified the authoritative source.", "I considered updates and deletions.", "I included a rebuild plan."],
    solution:
      "Keep published lessons in durable source storage. Start with database search if it meets the workload. If you add a separate index, copy edits and deletions through a reliable update process or reconcile them regularly. Check visibility before returning titles or snippets, and allow for update lag. Document how to rebuild from the source and verify the rebuilt index before relying on it.",
    diagram: ["Source records", "Update index", "Searchable view"],
    sources: ["indexes", "patterns", "consistency", "security"],
    terms: [
      ["Search index", "A lookup structure made for finding records by searchable content."],
      ["Derived view", "Data rebuilt from another authoritative source."],
      ["Rebuild", "Create a fresh copy from the source records."],
    ],
    scenario: "Two public lessons exist: Lesson 42 says “shortest path”; Lesson 43 says “sort a list.”",
    frames: [
      {
        action: "Store the published source records.",
        facts: [
          ["Lesson 42", "shortest path"],
          ["Lesson 43", "sort a list"],
        ],
        why: "These records are the source from which search can be rebuilt.",
        focus: 0,
      },
      {
        action: "Build a word-to-lesson view.",
        facts: [
          ["Word: path", "Lesson 42"],
          ["Word: sort", "Lesson 43"],
        ],
        why: "The index stores a useful lookup rather than becoming the only copy of the lessons.",
        focus: 1,
      },
      {
        action: "Search for “path.”",
        facts: [
          ["Candidate match", "Lesson 42"],
          ["Before returning", "Confirm it is still published and visible"],
        ],
        why: "An index entry may be stale after an edit or visibility change.",
        focus: 2,
      },
      {
        action: "Recover after the index is lost.",
        facts: [
          ["Source records", "Still present"],
          ["Recovery action", "Build the word-to-lesson view again"],
        ],
        why: "Recovery is possible because the index is derived, not the only source.",
        focus: 1,
      },
    ],
    solutionSteps: [
      "Keep published lessons in durable source storage. Start with database search if it meets the workload.",
      "If you add a separate index, copy edits and deletions through a reliable update process or reconcile them regularly.",
      "Check visibility before returning titles or snippets, and allow for update lag.",
      "Document how to rebuild from the source and verify the rebuilt index before relying on it.",
    ],
    concepts: ["indexes", "consistency", "authorization"],
  },
  {
    id: "regions",
    stage: 3,
    title: "Distance, recovery, and the cost of copies",
    idea: "Put data in more places only with a clear freshness and recovery plan.",
    explain: [
      "A server far from a reader adds network travel time. A CDN can help with public reads. Coordinating writes between distant locations is a harder problem.",
      "A recovery point objective, or RPO, says how much recent data loss is tolerable, expressed as a time window. An RPO of five minutes means you aim to lose no more than five minutes of changes.",
      "A recovery time objective, or RTO, says how long recovery may take. These are targets, not results guaranteed by naming a backup or replica.",
      "Test restoration and count the costs of extra copies, data transfer, and operational work. Add another active region only for a clear need and with an explicit write and failure plan.",
    ],
    walk: [
      "Record the recovery targets and available backup.",
      "An outage starts at 10:04.",
      "Restore and verify service at 10:20.",
      "Compare this exercise with the targets.",
    ],
    pitfall: "More regions can increase cost and failure complexity; they do not automatically provide zero data loss.",
    check: {
      prompt: "A team can tolerate at most 5 minutes of data loss. Which target is this?",
      options: ["RTO", "RPO", "Requests per second"],
      answer: 1,
      why: [
        "RTO is the tolerated recovery duration.",
        "Yes. RPO describes tolerated data loss as a time window.",
        "Traffic rate describes a different concern.",
      ],
    },
    task: "For a small personal learning app, choose a region and recovery approach. Include what you would measure before adding a second active region.",
    rubric: ["I stated recovery targets as targets.", "I included testing and copy costs.", "I justified extra regions with a real need."],
    solution:
      "Start with one suitable region and tested backups if that meets the actual requirements. Use a CDN for reusable public files. Define both tolerated data loss and tolerated recovery time. Measure a real restore exercise before promising recovery numbers. Include storage, transfer, and operating costs. Add an active region only when a measured need justifies it. Specify write authority, conflict handling, failover, and the guarantees that remain during a split.",
    diagram: ["Primary region", "Copies + backups", "Tested recovery"],
    sources: ["replication", "slo", "recovery"],
    terms: [
      ["Region", "A geographic location in which infrastructure runs."],
      ["RPO", "The target maximum window of recent changes that may be lost."],
      ["RTO", "The target maximum time to restore the needed service."],
    ],
    scenario: "A practice recovery has a 5-minute RPO and a 60-minute RTO. The last recoverable data is from 10:00.",
    frames: [
      {
        action: "Record the recovery targets and available backup.",
        facts: [
          ["Targets", "RPO: 5 minutes; RTO: 60 minutes"],
          ["Last recoverable data", "10:00"],
        ],
        why: "You need both target numbers and the actual recovery point.",
        focus: 0,
      },
      {
        action: "An outage starts at 10:04.",
        facts: [
          ["Changes at risk", "10:00 to 10:04"],
          ["Potential lost-data window", "4 minutes"],
        ],
        why: "The data-loss window compares the outage with the point to which you can restore.",
        focus: 1,
      },
      {
        action: "Restore and verify service at 10:20.",
        facts: [
          ["Outage start", "10:04"],
          ["Recovery duration", "16 minutes"],
        ],
        why: "Count until the needed service is restored and checked, not merely until a server starts.",
        focus: 2,
      },
      {
        action: "Compare this exercise with the targets.",
        facts: [
          ["Observed loss window", "4 minutes ≤ 5-minute target"],
          ["Observed recovery", "16 minutes ≤ 60-minute target"],
        ],
        why: "This exercise met the sample targets. One exercise does not guarantee every future incident will.",
        focus: 2,
      },
    ],
    solutionSteps: [
      "Start with one suitable region and tested backups if that meets the actual requirements.",
      "Use a CDN for reusable public files. Define both tolerated data loss and tolerated recovery time.",
      "Measure a real restore exercise before promising recovery numbers. Include storage, transfer, and operating costs.",
      "Add an active region only when a measured need justifies it. Specify write authority, conflict handling, failover, and the guarantees that remain during a split.",
    ],
    concepts: ["replication", "partitions", "operations", "cdn"],
  },
  {
    id: "short-links",
    stage: 4,
    title: "Design a short-link service",
    idea: "Make redirects fast without losing the mapping.",
    explain: [
      "Users create a short link and later follow it. Assume a peak of 10 new links per second and 1,000 redirects per second. Public links are in scope; analytics and custom domains are not.",
      "Keep a durable mapping from each unique code to its destination. Creating a link and following one are different request paths.",
      "Cache popular public mappings if measurements justify it. Decide what happens when a link changes, expires, or is removed.",
      "For editable links, think about browser caching as well as your server cache. A cached permanent redirect can bypass your server and keep sending someone to an old destination.",
    ],
    walk: [
      "Accept a creation request.",
      "Detect a collision without changing the old row.",
      "Try a fresh code and save it.",
      "Follow m8 using the redirect policy for editable links.",
    ],
    pitfall: "Even a random short code may already exist. Enforce uniqueness instead of overwriting another destination.",
    check: {
      prompt: "A generated short code already exists. What should creation do?",
      options: ["Overwrite the previous destination", "Enforce uniqueness and generate another code", "Return a random existing link"],
      answer: 1,
      why: [
        "That would break somebody else’s link.",
        "Yes. Detect the collision and retry with a bounded, safe creation flow.",
        "A valid response must point to the requested destination.",
      ],
    },
    task: "Design this service. Cover requirements, rough read/write load, APIs, mapping storage, collisions, caching, and one failure. Then adapt it for editable links.",
    rubric: [
      "I handled code uniqueness without overwriting.",
      "I traced creation and redirect separately.",
      "I explained invalidation and one failure mode.",
    ],
    solution:
      "Use POST /links to create a mapping and GET /{code} to follow one. Keep the unique code mapping in durable storage. A code collision must fail the insert without overwriting an existing destination. Generate a new candidate with a bounded retry. Measure read traffic and cache misses before scaling. Define missing and expired link responses and protect link creation from abuse. For editable links, update or invalidate server-side mappings and choose a browser redirect caching policy that meets freshness needs. A temporary redirect with no-store is one option; it cannot erase older permanent redirects already cached by clients.",
    diagram: ["Browser", "Redirect app + cache", "Unique mapping store"],
    sources: ["indexes", "cache", "framework", "redirects"],
    terms: [
      ["Collision", "Two attempted records use the same code."],
      ["Redirect", "A response telling the browser to request another URL."],
      ["Permanent redirect", "A redirect that clients may retain and reuse."],
    ],
    scenario: "An existing code k7 points to /old-lesson. A caller wants a new short link for /new-lesson.",
    frames: [
      {
        action: "Accept a creation request.",
        facts: [
          ["Request", "POST /links with destination /new-lesson"],
          ["Generated candidate", "k7"],
        ],
        why: "The candidate is only a proposal. It is not safe until uniqueness is enforced.",
        focus: 0,
      },
      {
        action: "Detect a collision without changing the old row.",
        facts: [
          ["Existing k7", "/old-lesson, unchanged"],
          ["Insert with k7", "Rejected by the unique constraint"],
        ],
        why: "Overwriting the old mapping would break someone else’s link.",
        focus: 2,
      },
      {
        action: "Try a fresh code and save it.",
        facts: [
          ["New code", "m8"],
          ["Saved mapping", "m8 → /new-lesson"],
        ],
        why: "A bounded creation retry can choose another code. Other simultaneous inserts still need the uniqueness rule.",
        focus: 2,
      },
      {
        action: "Follow m8 using the redirect policy for editable links.",
        facts: [
          ["Lookup result", "/new-lesson"],
          ["Example policy", "Temporary redirect, Cache-Control: no-store"],
        ],
        why: "The policy avoids retaining this redirect in the browser. Server-side cached mappings still need their own update plan.",
        focus: 1,
      },
    ],
    solutionSteps: [
      "Use POST /links to create a mapping and GET /{code} to follow one. Keep the unique code mapping in durable storage.",
      "A code collision must fail the insert without overwriting an existing destination. Generate a new candidate with a bounded retry.",
      "Measure read traffic and cache misses before scaling. Define missing and expired link responses and protect link creation from abuse.",
      "For editable links, update or invalidate server-side mappings and choose a browser redirect caching policy that meets freshness needs. A temporary redirect with no-store is one option; it cannot erase older permanent redirects already cached by clients.",
    ],
    concepts: ["api", "indexes", "cache", "limits"],
  },
  {
    id: "notifications",
    stage: 4,
    title: "Design a notification service",
    idea: "Deliver useful messages while handling retries and duplicates.",
    explain: [
      "A booking service produces up to 100 notification jobs per second at peak. The example target is to hand each message to the provider within a minute. Arrival in a person’s inbox is a separate outcome.",
      "Keep booking success separate from notification success. The booking remains visible in the app even if an email provider is unavailable.",
      "Use an outbox, queue, and workers. Check the recipient’s current preferences before sending optional reminders.",
      "Repeated delivery and worker crashes are normal failure cases to plan for. A local “sent” flag alone cannot close every gap around an external provider call.",
    ],
    walk: [
      "Commit the booking and notification event together.",
      "Deliver the event to a worker through the queue.",
      "The provider accepts the email, but the worker loses the reply.",
      "Recover the provider result and record completion.",
    ],
    pitfall: "No local ‘sent’ flag can by itself guarantee exactly one external send across every crash point.",
    check: {
      prompt: "The email provider accepts a message, then your worker crashes before recording success. What is the risk?",
      options: ["A retry can send a duplicate", "The original booking must disappear", "A queue proves delivery happened once"],
      answer: 0,
      why: [
        "Yes. Coordinate with provider idempotency or explicitly accept and manage that residual risk.",
        "Notification failure should not erase a confirmed booking.",
        "Queue delivery and external message effects are separate guarantees.",
      ],
    },
    task: "Design a notification pipeline. Include opt-out checks, a retry budget, duplicate handling, failed jobs, and the metric that shows users are waiting.",
    rubric: [
      "I handled the provider-success/crash gap.",
      "I included delivery preferences and retry limits.",
      "I measured oldest-job age or end-to-end delay.",
    ],
    solution:
      "Save a notification outbox event with the booking. Publish it reliably to a queue. Check current preferences for optional messages. Use a stable event-recipient-channel key and the provider’s idempotency contract when available. Record the result before acknowledging work. Bound retries and retain persistent failures for investigation; do not retry indefinitely. Track provider acceptance delay, errors, and oldest-job age against the stated target. Distinguish provider acceptance from inbox arrival, and document any remaining duplicate-send risk.",
    diagram: ["Outbox", "Queue + workers", "Provider + delivery record"],
    sources: ["queues", "idempotency", "retries", "outbox"],
    terms: [
      ["Delivery key", "A stable identifier for one event, recipient, and channel."],
      ["Retry budget", "A limit on how many retries or how much retry time is allowed."],
      ["Oldest-job age", "How long the oldest pending job has waited."],
    ],
    scenario:
      "Reservation 83 is confirmed. Its owner needs an email. Assume the provider offers idempotency for this operation and retention window.",
    frames: [
      {
        action: "Commit the booking and notification event together.",
        facts: [
          ["Booking status", "Confirmed"],
          ["Outbox event", "event-83"],
        ],
        why: "A committed booking leaves durable evidence that notification work is still required.",
        focus: 0,
      },
      {
        action: "Deliver the event to a worker through the queue.",
        facts: [
          ["Recipient preference", "Confirmation email enabled"],
          ["Stable key", "event-83 + Student 7 + email"],
        ],
        why: "The same intended delivery keeps the same key on every retry.",
        focus: 1,
      },
      {
        action: "The provider accepts the email, but the worker loses the reply.",
        facts: [
          ["Worker certainty", "Outcome unknown"],
          ["Retry action", "Reuse the delivery key within its supported lifetime"],
        ],
        why: "A timeout does not mean the provider did nothing.",
        focus: 2,
      },
      {
        action: "Recover the provider result and record completion.",
        facts: [
          ["Booking status", "Still confirmed"],
          ["Queue action", "Acknowledge after recording the result"],
        ],
        why: "Track delay and failures. Without the provider’s promised deduplication, a repeated call can still send another email.",
        focus: 2,
      },
    ],
    solutionSteps: [
      "Save a notification outbox event with the booking. Publish it reliably to a queue.",
      "Check current preferences for optional messages. Use a stable event-recipient-channel key and the provider’s idempotency contract when available.",
      "Record the result before acknowledging work. Bound retries and retain persistent failures for investigation; do not retry indefinitely.",
      "Track provider acceptance delay, errors, and oldest-job age against the stated target. Distinguish provider acceptance from inbox arrival, and document any remaining duplicate-send risk.",
    ],
    concepts: ["queues", "retry", "operations", "authorization"],
  },
  {
    id: "uploads",
    stage: 4,
    title: "Design a file upload service",
    idea: "Large bytes and private metadata need different paths.",
    explain: [
      "Students upload private PDFs of up to 20 MB. An interrupted upload should not appear as a ready attachment. Other students must not be able to download it.",
      "Store file bytes in object storage and the owner, status, and storage reference in the database. Use pending, validating, and ready states.",
      "A temporary upload URL can be reused until its limits expire. Some stores allow it to overwrite the same object. Do not assume that one successful upload consumes the permission.",
      "Validate a fixed snapshot and publish that exact snapshot. For example, copy the pending upload to a new private key the browser cannot overwrite, then scan that copy before marking it ready.",
    ],
    walk: [
      "Authorize one pending upload.",
      "Upload bytes and verify the stored object.",
      "Create and validate a fixed private snapshot.",
      "Publish that snapshot and authorize downloads.",
    ],
    pitfall: "A filename extension or a client’s ‘upload finished’ message does not prove the stored file is safe or complete.",
    check: {
      prompt: "The browser says its upload is complete. What should happen before the file becomes usable?",
      options: ["Make the whole storage bucket public", "Trust the filename", "Verify the stored object and required validation"],
      answer: 2,
      why: [
        "That would expose private content.",
        "Names do not prove content type or integrity.",
        "Yes. Confirm storage state and validation before publishing the usable status.",
      ],
    },
    task: "Design private uploads, including metadata, byte storage, interrupted uploads, validation, downloads, and abandoned-file cleanup.",
    rubric: ["I separated bytes and metadata.", "I used narrow access and verified completion.", "I included incomplete uploads and cleanup."],
    solution:
      "Create a pending upload record with owner, quota, size limits, and a narrowly scoped temporary upload permission. After upload, verify the actual object and capture a fixed version or private snapshot. If copying, validate the copy that will be published. Check size, actual file type, and required safety scans before marking that exact snapshot ready. Do not let a reusable pending upload URL overwrite approved bytes. Verify ownership before downloads. Support interrupted uploads as needed, and clean abandoned pending objects after a safe grace period without racing active work.",
    diagram: ["Authorized upload API", "Private object storage", "Validation worker"],
    sources: ["security", "cache", "queues", "uploads"],
    terms: [
      ["Upload permission", "A limited right to write a specific pending object."],
      ["Snapshot", "A fixed copy or version used for validation."],
      ["Finalization", "Marking the approved, fixed file version as ready."],
    ],
    scenario: "Student 7 uploads a 4 MB PDF. The policy limit is 20 MB. The app separates pending upload objects from approved objects.",
    frames: [
      {
        action: "Authorize one pending upload.",
        facts: [
          ["Owner", "Student 7"],
          ["Upload record", "91, pending; allowed pending key only"],
        ],
        why: "Verify ownership, quota, and permitted upload scope before granting access.",
        focus: 0,
      },
      {
        action: "Upload bytes and verify the stored object.",
        facts: [
          ["Stored size", "4 MB, within the 20 MB limit"],
          ["Status", "Not yet ready"],
        ],
        why: "A browser’s “finished” message or a .pdf suffix does not prove safety or completeness.",
        focus: 1,
      },
      {
        action: "Create and validate a fixed private snapshot.",
        facts: [
          ["Approved candidate key", "final/91/v1, not writable by the upload URL"],
          ["Checks", "Actual type, size, and required safety scan"],
        ],
        why: "Scan the copy you will publish. Reusing the old pending URL must not replace the approved bytes.",
        focus: 2,
      },
      {
        action: "Publish that snapshot and authorize downloads.",
        facts: [
          ["Ready record points to", "final/91/v1"],
          ["Download allowed to", "Student 7, under the private ownership rule"],
        ],
        why: "Keep abandoned-upload cleanup away from active uploads and referenced approved files.",
        focus: 0,
      },
    ],
    solutionSteps: [
      "Create a pending upload record with owner, quota, size limits, and a narrowly scoped temporary upload permission.",
      "After upload, verify the actual object and capture a fixed version or private snapshot. If copying, validate the copy that will be published.",
      "Check size, actual file type, and required safety scans before marking that exact snapshot ready. Do not let a reusable pending upload URL overwrite approved bytes.",
      "Verify ownership before downloads. Support interrupted uploads as needed, and clean abandoned pending objects after a safe grace period without racing active work.",
    ],
    concepts: ["cdn", "authorization", "queues", "transactions"],
  },
  {
    id: "chat",
    stage: 4,
    title: "Design a small group chat",
    idea: "Messages need durable history as well as a live connection.",
    explain: [
      "Study groups need text chat for up to 20 members. Messages should usually appear within a second. Members can disconnect and return.",
      "Save a message before acknowledging durable acceptance. Acceptance means the service saved it; it does not mean another person received or read it.",
      "Use one stable client message ID per intended send. The server checks membership, detects repeated sends, and assigns a defined order within the conversation.",
      "Live updates need durable history behind them. Reconnect from the last consecutive message received, and bridge replay with the live stream without leaving a gap.",
    ],
    walk: [
      "Verify membership and accept the send request.",
      "Store the message and its duplicate-detection key.",
      "The reply is lost; retry the same client ID.",
      "A member reconnects after sequence 80.",
    ],
    pitfall: "A socket send succeeding does not prove that a recipient stored or even saw the message.",
    check: {
      prompt: "A user reconnects after missing five messages. Which design recovers them?",
      options: ["Keep messages only in socket memory", "Store history and resume after a known position", "Start a new conversation automatically"],
      answer: 1,
      why: [
        "Memory on the disconnected path is not durable history.",
        "Yes. Replay from durable history and reconcile with live delivery.",
        "A reconnect should not destroy conversation continuity.",
      ],
    },
    task: "Design group chat. Cover membership, send retries, persistence, ordering scope, live delivery, and reconnect races.",
    rubric: ["I separated acceptance, delivery, and reading.", "I defined ordering per conversation.", "I explained replay and duplicate handling."],
    solution:
      "Check group membership on sends, history reads, and subscriptions. Store accepted messages durably. Scope a stable send ID to the caller and conversation. Enforce uniqueness and assign a clear per-conversation order. Acknowledge durable acceptance separately from delivery and reading. On retry, return the existing message outcome. Reconnect from the last consecutive position. Use a gap-free replay protocol, or subscribe and buffer before fetching the missing range, then merge by stable ID. Deduplication alone does not recover a message that was never fetched or streamed.",
    diagram: ["Members", "Chat API + live updates", "Ordered durable history"],
    sources: ["idempotency", "security", "patterns", "realtime"],
    terms: [
      ["Client message ID", "A stable ID reused when retrying the same intended send."],
      ["Conversation order", "The order agreed for messages within one chat."],
      ["Read receipt", "A separate indication that a recipient read a message."],
    ],
    scenario: "Student 7 belongs to Group 42. The conversation is stored through sequence 80. The next intended send has client ID student7:m9.",
    frames: [
      {
        action: "Verify membership and accept the send request.",
        facts: [
          ["Conversation", "Group 42"],
          ["Client message ID", "student7:m9"],
        ],
        why: "Check access to this group, not merely whether the caller is signed in.",
        focus: 0,
      },
      {
        action: "Store the message and its duplicate-detection key.",
        facts: [
          ["Server sequence", "81"],
          ["Saved text", "Shall we start with BFS?"],
        ],
        why: "For this design, one coordinated per-conversation ordering path assigns positions. The durable message exists before its acceptance reply.",
        focus: 2,
      },
      {
        action: "The reply is lost; retry the same client ID.",
        facts: [
          ["Retry ID", "student7:m9"],
          ["Returned existing sequence", "81, not a new message"],
        ],
        why: "A uniqueness rule for the intended send prevents a duplicate message when requests overlap.",
        focus: 1,
      },
      {
        action: "A member reconnects after sequence 80.",
        facts: [
          ["Replay contains", "Message 81"],
          ["Delivery rule", "No gap between replay and new live messages"],
        ],
        why: "Repeated messages are discarded by ID. Acknowledgement of storage is still different from recipient delivery or reading.",
        focus: 2,
      },
    ],
    solutionSteps: [
      "Check group membership on sends, history reads, and subscriptions. Store accepted messages durably.",
      "Scope a stable send ID to the caller and conversation. Enforce uniqueness and assign a clear per-conversation order.",
      "Acknowledge durable acceptance separately from delivery and reading. On retry, return the existing message outcome.",
      "Reconnect from the last consecutive position. Use a gap-free replay protocol, or subscribe and buffer before fetching the missing range, then merge by stable ID. Deduplication alone does not recover a message that was never fetched or streamed.",
    ],
    concepts: ["realtime", "retry", "authorization", "transactions"],
  },
  {
    id: "feed",
    stage: 4,
    title: "Design a learning activity feed",
    idea: "Move work to the write path or the read path for a reason.",
    explain: [
      "Learners follow public posts. Most authors have about 50 followers; a few have 100,000. Begin with a chronological feed. Private notes are out of scope.",
      "One plan adds a reference to each follower’s feed when an author publishes. That makes later reads easier but adds write work at publication.",
      "Another plan collects followed authors’ posts when a person reads. That saves some publication work but makes each read do more.",
      "A mixed plan can treat very popular authors differently. In every plan, define pagination, deletion, and privacy changes. A stored feed reference does not make a post permanently public.",
    ],
    walk: [
      "Publish Author A’s post using write-time fan-out.",
      "Estimate the same strategy for Author B.",
      "Consider merging B’s recent posts during a feed read.",
      "Return only currently visible posts in stable order.",
    ],
    pitfall: "A precomputed feed can still contain a reference to a deleted or newly private post. Check visibility at read time as needed.",
    check: {
      prompt: "A popular author has 100,000 followers. What is a cost of copying a reference to every feed on each post?",
      options: ["A large burst of write work", "No extra work", "Automatic perfect privacy"],
      answer: 0,
      why: [
        "Yes. Fan-out on write can move a large cost to publication.",
        "Every destination needs an update.",
        "Visibility changes and deletion still need explicit handling.",
      ],
    },
    task: "Design a chronological feed for this uneven follower distribution. Compare write-time fan-out, read-time merging, and a mixed approach.",
    rubric: ["I explained where the work happens.", "I considered unusually popular authors.", "I handled privacy changes and stable pagination."],
    solution:
      "Start with source posts, follows, and a query that builds a chronological feed if that meets the workload. Compare copying references on publish with gathering posts on read. Account for popular authors rather than assuming all accounts behave alike. A mixed approach may precompute ordinary-author references and merge selected popular-author posts on read. Measure the resulting write and read costs. Use stable cursor ordering with a unique tie-breaker. Enforce visibility before returning content, process edits and deletions, and keep a rebuild path from source records.",
    diagram: ["Posts + follows", "Derived feed or read merge", "Authorized page"],
    sources: ["patterns", "consistency", "security"],
    terms: [
      ["Fan-out on write", "Add feed entries for followers when a post is published."],
      ["Fan-out on read", "Gather followed authors’ posts when reading a feed."],
      ["Feed reference", "An entry pointing to a source post rather than copying all its content."],
    ],
    scenario: "For a small worked example, Author A has 3 followers. Author B has 100,000. Both publish public posts.",
    frames: [
      {
        action: "Publish Author A’s post using write-time fan-out.",
        facts: [
          ["Followers", "3"],
          ["Feed references added", "3"],
        ],
        why: "This small write burst can simplify those followers’ later reads.",
        focus: 0,
      },
      {
        action: "Estimate the same strategy for Author B.",
        facts: [
          ["Followers", "100,000"],
          ["References per new post", "100,000"],
        ],
        why: "A single popular author can create a large write burst.",
        focus: 1,
      },
      {
        action: "Consider merging B’s recent posts during a feed read.",
        facts: [
          ["Write-time copies for B in this plan", "None required per follower"],
          ["New cost", "More work while building the reader’s page"],
        ],
        why: "This is a trade-off, not a free reduction of every kind of work.",
        focus: 1,
      },
      {
        action: "Return only currently visible posts in stable order.",
        facts: [
          ["Order example", "Publication time plus unique post ID"],
          ["Deleted or private post", "Omit from the returned page"],
        ],
        why: "Stale feed references must not expose private titles or content.",
        focus: 2,
      },
    ],
    solutionSteps: [
      "Start with source posts, follows, and a query that builds a chronological feed if that meets the workload.",
      "Compare copying references on publish with gathering posts on read. Account for popular authors rather than assuming all accounts behave alike.",
      "A mixed approach may precompute ordinary-author references and merge selected popular-author posts on read. Measure the resulting write and read costs.",
      "Use stable cursor ordering with a unique tie-breaker. Enforce visibility before returning content, process edits and deletions, and keep a rebuild path from source records.",
    ],
    concepts: ["search", "queues", "consistency", "authorization"],
  },
  {
    id: "booking",
    stage: 4,
    title: "Design a booking system you can defend",
    idea: "Keep the last-seat rule true through races, retries, and failures.",
    explain: [
      "Students reserve limited seats in study groups. Assume a peak of 50 booking requests per second. Never confirm more seats than a group has. Payments and choosing particular seats are out of scope.",
      "The database decides who gets the seat. A cached count can help the display, but it cannot authorize a confirmation.",
      "Save the seat claim, reservation, operation outcome, and notification outbox event together. A retry must recognize the same intended booking.",
      "Keep notification delivery separate from the booking outcome. Then explain failures, ownership checks, monitoring, and recovery before adding more infrastructure.",
    ],
    walk: [
      "Verify both callers and preserve their operation keys.",
      "A wins the coordinated conditional update and commits.",
      "B cannot claim the occupied seat; A safely retries a lost reply.",
      "The email provider is unavailable.",
    ],
    pitfall: "A cached seat count is useful for display, but it is not permission to confirm a booking.",
    check: {
      prompt: "The email service is down after a seat was booked durably. What should the app report?",
      options: ["Booking failed, so create another one", "All seats are free again", "Booking confirmed; notification delivery is delayed"],
      answer: 2,
      why: [
        "That could duplicate a successful booking.",
        "Email failure does not reverse a committed seat claim.",
        "Yes. Keep the booking outcome distinct from the notification outcome.",
      ],
    },
    task: "Write a complete design using the six notebook prompts. Defend your last-seat rule, unknown outcomes after timeouts, notification reliability, privacy, and recovery. Then change one assumption: demand rises by 100×.",
    rubric: [
      "I preserved the seat invariant under concurrency and retry.",
      "I separated durable booking and notification delivery.",
      "I explained a measured scaling and recovery plan.",
    ],
    solution:
      "State the 50-request/second peak, seat rule, APIs, ownership checks, and stable caller-scoped operation keys. In a database transaction, enforce capacity with a coordinated conditional update and save the reservation, operation result, and outbox event. Inspect the affected-row result and roll back required writes on failure. Return the saved outcome on a matching retry. Notify asynchronously, with bounded retries and explicit duplicate-effect limits. Keep booking state authoritative. Define service signals and tested recovery targets. A 100× workload is 5,000 requests/second: measure application capacity and seat-row contention before scaling. Keep the seat authority coordinated; adding servers alone cannot fix a hot contested row.",
    diagram: ["Booking API", "Atomic seat + outcome + outbox", "Worker + notification"],
    sources: ["transactions", "idempotency", "queues", "security", "isolation", "outbox", "recovery"],
    terms: [
      ["Seat invariant", "The rule that confirmed reservations never exceed capacity."],
      ["Authority", "The part responsible for making a coordinated decision."],
      ["Contention", "Requests waiting or competing to change the same resource."],
    ],
    scenario: "Group 42 has one seat left. Students A and B each try to book it. A uses operation key a1; B uses b1.",
    frames: [
      {
        action: "Verify both callers and preserve their operation keys.",
        facts: [
          ["A’s intended operation", "A + a1"],
          ["B’s intended operation", "B + b1"],
        ],
        why: "Different people’s operation keys need separate scopes. Each person reuses their own key on retries.",
        focus: 0,
      },
      {
        action: "A wins the coordinated conditional update and commits.",
        facts: [
          ["Saved booking", "Reservation 83 for A"],
          ["Committed together", "Seat count, reservation, a1 outcome, outbox event"],
        ],
        why: "If any required database write fails, roll the transaction back.",
        focus: 1,
      },
      {
        action: "B cannot claim the occupied seat; A safely retries a lost reply.",
        facts: [
          ["B’s changed rows", "0 → no confirmation"],
          ["A’s retry result", "Existing Reservation 83"],
        ],
        why: "Check affected rows and deduplicate the operation. Neither request should create another seat.",
        focus: 1,
      },
      {
        action: "The email provider is unavailable.",
        facts: [
          ["A’s booking", "Still confirmed"],
          ["Notification", "Pending, with bounded retry and delay monitoring"],
        ],
        why: "An email failure does not undo a confirmed booking or make that seat free again.",
        focus: 2,
      },
    ],
    solutionSteps: [
      "State the 50-request/second peak, seat rule, APIs, ownership checks, and stable caller-scoped operation keys.",
      "In a database transaction, enforce capacity with a coordinated conditional update and save the reservation, operation result, and outbox event. Inspect the affected-row result and roll back required writes on failure.",
      "Return the saved outcome on a matching retry. Notify asynchronously, with bounded retries and explicit duplicate-effect limits. Keep booking state authoritative.",
      "Define service signals and tested recovery targets. A 100× workload is 5,000 requests/second: measure application capacity and seat-row contention before scaling. Keep the seat authority coordinated; adding servers alone cannot fix a hot contested row.",
    ],
    concepts: ["transactions", "retry", "queues", "authorization", "operations", "regions"],
  },
];

// The guided path is sequential; concepts also record the actual knowledge dependencies.
systemLessons.forEach((lesson, index) => {
  lesson.position = index + 1;
  lesson.requires = [...new Set([...(index ? [systemLessons[index - 1].id] : []), ...lesson.concepts])];
});
export const systemLessonById = Object.assign(Object.create(null), Object.fromEntries(systemLessons.map((lesson) => [lesson.id, lesson])));

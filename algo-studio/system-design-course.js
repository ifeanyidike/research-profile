// Original teaching examples. References explain the underlying concepts, not a single ideal architecture.
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
};
export const systemStages = [
  { title: "Make one system work", summary: "Follow a request. Decide what to store and what must stay correct." },
  { title: "Handle more work", summary: "Measure a bottleneck before adding another moving part." },
  { title: "Keep working when things fail", summary: "Reason about retries, copies, disagreement, and overload." },
  { title: "Make it safe and operable", summary: "Protect data, find failures, and make sensible boundaries." },
  { title: "Design complete systems", summary: "Bring the ideas together in six practical design studios." },
];
const q = (prompt, options, answer, why) => ({ prompt, options, answer, why });
const lesson = (id, stage, title, idea, explain, walk, pitfall, check, task, rubric, solution, diagram, sources, lab) => ({
  id,
  stage,
  title,
  idea,
  explain,
  walk,
  pitfall,
  check,
  task,
  rubric,
  solution,
  diagram,
  sources,
  lab,
});
export const systemLessons = [
  lesson(
    "requirements",
    0,
    "Start with the person, not the boxes",
    "A useful design starts with a clear job for a real person.",
    [
      "Imagine a small library. A reader wants to reserve a book. Before choosing a database, write down what a successful reservation means.",
      "Separate what people can do from how well it must work. ‘Reserve a book’ is a feature. ‘Never promise the last copy to two readers’ is a correctness rule. ‘Reply within one second for most requests’ is a speed target. State who uses it, the expected traffic, and what can wait.",
    ],
    [
      "Name one user: a reader using a phone.",
      "Name one action: reserve one available book.",
      "Name one rule: one copy can have only one active reservation.",
      "Keep recommendations and late fees out of this first version.",
    ],
    "‘Handle millions of users’ does not tell you how many requests arrive at once. Ask for a measurable workload.",
    q(
      "The library has one copy left. Which requirement tells you what must stay correct?",
      ["Use five servers", "Only one reader can reserve that copy", "Use a popular database"],
      1,
      [
        "A server count is a design choice. It does not state the rule.",
        "Yes. This rule lets you judge whether a proposed design is safe.",
        "A product name does not explain what the system must guarantee.",
      ]
    ),
    "Design the first version of a study-group booking tool. Write its user, two actions, one correctness rule, and one feature you will leave out.",
    ["I named a user and two actions.", "I wrote a rule that can be tested.", "I deliberately left something out."],
    "Students can create a study session and reserve a seat. A session cannot have more confirmed reservations than seats. Start with one campus and 100 bookings per day. Leave chat out. A server and relational database are enough to investigate first.",
    ["Student", "Booking server", "Reservations"],
    ["framework", "roadmap"]
  ),
  lesson(
    "request",
    0,
    "Follow one request all the way",
    "A browser asks. A server does the work. A database remembers.",
    [
      "The browser is the client: the program making a request. The server receives the request and sends a response. The database keeps information after a process restarts.",
      "For a website, DNS helps find the server’s network address. HTTPS encrypts the connection. A reverse proxy can receive web traffic and pass it to the application. Start by following one request through these roles. You do not need a separate machine for every box.",
    ],
    [
      "You tap ‘My reservations’. The browser sends an HTTPS request.",
      "The application checks who you are.",
      "It asks the database for reservations belonging to your account.",
      "It returns the results. Your browser displays them.",
    ],
    "A successful screen update does not prove the database saved anything. Send success only when the required durable write has succeeded.",
    q(
      "The app restarts. Where should confirmed reservations survive?",
      ["Only in a variable inside the server", "Only in the button’s text", "In durable storage such as the database"],
      2,
      [
        "Process memory can disappear during a restart.",
        "A label in a browser is not shared durable storage.",
        "Yes. The database should be the source of truth for confirmed reservations.",
      ]
    ),
    "Trace a student saving a lesson note: request, identity check, database write, response. Explain what happens if the write fails.",
    ["I traced the request and response.", "I named where the note is stored.", "I did not report success after a failed write."],
    "The browser sends the note and its lesson ID over HTTPS. The server verifies the session and account ownership. It writes the note to the database. After the write succeeds, it replies with the saved version. On failure, it returns an error; the browser keeps the unsaved draft and offers retry.",
    ["Browser", "Application", "Database"],
    ["http"]
  ),
  lesson(
    "api",
    0,
    "Give each request a clear contract",
    "An API is an agreement about what to send and what comes back.",
    [
      "Write down the request before implementing it. For a reservation, POST /reservations might accept a session ID. A successful response includes a reservation ID and status.",
      "Specify failure responses too. An expired session needs a sign-in response. A full study group needs a ‘no seats left’ response. For long lists, return one page at a time. A cursor is a marker telling the server where the next page begins.",
    ],
    [
      "Request: POST /reservations with session_id = 42.",
      "Server derives the student ID from the verified sign-in session.",
      "Success: return 201 with reservation_id = 83.",
      "If the group is full, return a conflict response such as 409 with a useful message.",
    ],
    "Do not trust an account ID in the request body as proof of who is making the request.",
    q(
      "A request says user_id = 7. What should establish the caller’s identity?",
      ["The verified sign-in session", "The number in the body", "The button the caller clicked"],
      0,
      [
        "Yes. The server verifies identity and then checks permission.",
        "Anyone can change a request body.",
        "Clients can send requests without using your buttons.",
      ]
    ),
    "Write a small API contract for reading one page of your own notes. Include input, success, next-page marker, and an expired-session response.",
    ["I included a page size or cursor.", "The server derives the caller’s identity.", "I included an error response."],
    "GET /notes?limit=20&cursor=abc uses the verified session to select only that user’s notes. Return 200 with items and next_cursor, or null when finished. Use a stable ordering with a unique tie-breaker. Return 401 for a missing or expired session.",
    ["Request + session", "Validate + authorize", "Result or error"],
    ["http", "security"]
  ),
  lesson(
    "data",
    0,
    "Store facts around the questions you ask",
    "Choose a data shape by writing the reads and writes it must support.",
    [
      "For study groups, store sessions, students, and reservations. Give each record a stable ID. A reservation connects a student to a session.",
      "A relational database is a useful starting point when relationships and constraints matter. A document store can suit data read together as one document. Neither choice automatically makes a system scalable. Ask which queries, updates, and correctness rules you need.",
    ],
    [
      "sessions: id, title, seat_limit.",
      "reservations: id, session_id, student_id, status.",
      "Read one session with its active reservations.",
      "Prevent duplicate active bookings using a suitable constraint or transactional rule.",
    ],
    "Putting a whole app into one growing document can make unrelated updates compete and create very large reads.",
    q(
      "Which question is most useful before choosing a data store?",
      ["Which logo looks best?", "What must we read, update, and keep correct?", "Which product always wins?"],
      1,
      ["Branding does not establish the workload.", "Yes. Workload and constraints guide the choice.", "There is no universally best database."]
    ),
    "Sketch records for students, lessons, and saved notes. Show how you find one student’s note for one lesson.",
    ["I gave records stable IDs.", "I showed relationships.", "I named the query and a uniqueness rule."],
    "Use students(id), lessons(id), and notes(student_id, lesson_id, text, updated_at). A unique pair (student_id, lesson_id) gives each learner one current note per lesson. Query by both IDs. Derive student_id from the verified session.",
    ["Students", "Notes link both IDs", "Lessons"],
    ["transactions", "framework"]
  ),
  lesson(
    "transactions",
    0,
    "Keep related changes together",
    "A transaction groups changes so they commit together or roll back together.",
    [
      "Suppose the last seat is available. Two students both read ‘one seat left’. If both then save a booking without coordination, the group is overbooked.",
      "A transaction alone does not make every read-then-write sequence safe at every isolation level. Use an atomic conditional update, a suitable lock, or an isolation level with retries. Keep the seat claim and reservation record in the same transaction.",
    ],
    [
      "Begin a database transaction.",
      "Atomically increase booked seats only when booked < seat_limit.",
      "If one row changed, insert the reservation. Otherwise report ‘full’.",
      "Commit both changes together. Roll back if either fails.",
    ],
    "Checking availability in the browser is helpful feedback, but it cannot enforce a shared correctness rule.",
    q(
      "Two requests compete for the last seat. Which plan can protect it?",
      [
        "Both read the count, then both insert",
        "Disable the button in one browser",
        "Use a conditional database update and reservation in one transaction",
      ],
      2,
      [
        "Both requests can read the same old count.",
        "Other browsers can still book.",
        "Yes. Check the database result and commit the claim with the reservation.",
      ]
    ),
    "Describe a safe last-seat booking. Include what the losing request sees and what happens if inserting the reservation fails.",
    ["The seat claim is coordinated in the database.", "The reservation and claim commit together.", "I explained failure and the losing request."],
    "In one transaction, claim a seat using UPDATE ... WHERE booked < seat_limit. Check the affected-row count. If zero, return ‘full’. If one, insert the reservation and commit. If insertion fails, roll back the claim. Add an appropriate uniqueness rule for repeated student bookings.",
    ["Two booking requests", "Atomic seat claim", "One confirmed booking"],
    ["transactions"]
  ),
  lesson(
    "indexes",
    0,
    "Find a record without reading them all",
    "An index is an extra lookup structure that can make a query faster.",
    [
      "A library catalogue helps you find a book without walking past every shelf. A database index plays a similar role.",
      "For ‘all notes for student 7 ordered by date’, an index starting with student_id and then the ordering fields may help. Indexes also take space and add work to writes. Inspect the real query plan before assuming an index is useful.",
    ],
    [
      "The query filters notes by student_id.",
      "It orders by updated_at and a unique ID.",
      "Try an index matching that filter and ordering.",
      "Measure the query plan and latency. Keep the index only if it helps the workload.",
    ],
    "An index on every column is not a free speed upgrade. Writes must maintain those extra structures.",
    q(
      "You add an index to speed up note reads. What cost should you consider?",
      ["Extra storage and write work", "It always deletes old notes", "It makes every query equally fast"],
      0,
      [
        "Yes. Faster access can trade off against storage and update cost.",
        "Creating an ordinary index does not delete note records.",
        "An index helps some access patterns, not all queries.",
      ]
    ),
    "Choose an index for listing one student’s reservations newest first. State the query and one cost of the index.",
    ["The index matches a stated query.", "The ordering has a unique tie-breaker.", "I named storage or write overhead."],
    "Filter by student_id and order by created_at plus reservation_id. Consider a composite index on those fields in a useful order. Check its query plan with realistic data. Each inserted reservation also adds an index entry, using space and write effort.",
    ["Query", "Index lookup", "Matching records"],
    ["indexes"]
  ),
  lesson(
    "estimates",
    1,
    "Turn a workload into small numbers",
    "Estimate requests per second before guessing how many servers you need.",
    [
      "Suppose 8,640 people each make 10 requests per day. That is 86,400 requests per day. Divide by 86,400 seconds: the daily average is one request per second.",
      "The average hides busy moments. If peak traffic is ten times the average, plan to investigate 10 requests per second. Storage estimates need a record size and retention period. Write units next to every number and label assumptions.",
    ],
    [
      "8,640 users × 10 requests = 86,400 requests/day.",
      "86,400 ÷ 86,400 = 1 request/second on average.",
      "Assume a 10× peak: 10 requests/second.",
      "If 1,000 new records/day use 500 bytes each, raw growth is 500,000 bytes/day, before indexes and copies.",
    ],
    "Registered users are not simultaneous requests. Do not turn an account count directly into a server count.",
    q("86,400 requests per day gives what daily average?", ["86,400 requests per second", "1 request per second", "24 requests per second"], 1, [
      "You still need to divide by seconds per day.",
      "Yes. There are 86,400 seconds in one day.",
      "Hours and seconds are different units.",
    ]),
    "Estimate average and peak requests for 17,280 users making 5 requests/day. Assume peak is 8× average. Write each calculation with units.",
    ["I calculated requests per day first.", "I divided by 86,400 seconds.", "I labelled the peak multiplier as an assumption."],
    "17,280 × 5 = 86,400 requests/day. Divide by 86,400 seconds/day to get 1 request/second on average. With an assumed 8× peak, investigate 8 requests/second. These are planning estimates; measure real traffic before sizing production.",
    ["People × actions", "Requests/day", "Average → assumed peak"],
    ["framework"],
    "capacity"
  ),
  lesson(
    "metrics",
    1,
    "Speed and capacity are different questions",
    "Latency is how long one request waits. Throughput is how much work finishes per second.",
    [
      "A café can serve many drinks per minute while one customer waits a long time. Systems can have the same mismatch.",
      "An average can hide a slow minority. The 95th percentile, or p95, is a value at or below which roughly 95% of observations fall. Track it alongside error rate and throughput. Measure the user-visible operation, not only one fast internal call.",
    ],
    [
      "Record the time from sending a request to receiving its response.",
      "Sort the observed times to inspect slow requests.",
      "Count successful responses per second separately.",
      "For this exercise, target at least 95% of reads within 300 ms during a stated traffic level.",
    ],
    "A low average is not proof that almost everyone gets a quick response.",
    q(
      "Most reads take 50 ms, but some take 5 seconds. What helps reveal the slow group?",
      ["Only the daily request total", "Only the fastest request", "Latency percentiles and the distribution"],
      2,
      [
        "Volume does not tell you how long individual requests wait.",
        "The fastest request hides the slow ones.",
        "Yes. Inspect tail latency and errors under a stated load.",
      ]
    ),
    "Define a speed target and a success-rate target for reading a saved note. Include a measurement window and which requests count.",
    ["I separated latency and success rate.", "I defined the eligible requests and window.", "My targets are measurable."],
    "Over a rolling seven days, at least 99.9% of eligible authenticated note reads should succeed; at least 95% should finish within 300 ms. Define eligibility and where timing starts. These are example targets to discuss, not a promise the current app makes.",
    ["Request timing", "Latency distribution", "Target + error rate"],
    ["slo"]
  ),
  lesson(
    "scale",
    1,
    "Add servers without losing a person’s place",
    "Any application server should be able to handle the next request.",
    [
      "A load balancer routes incoming requests to application servers. More servers can help when application processing is the bottleneck.",
      "If a student’s draft lives only in server A’s memory, server B cannot see it. Keep shared durable state in a database and use a session design every server can verify. Health checks help remove unhealthy servers. The database can still be the bottleneck.",
    ],
    [
      "A load balancer sends a read to server A.",
      "Server A reads the student’s saved note from the shared database.",
      "The next request goes to server B, which reads the same database.",
      "If A fails, route new requests to healthy servers; handle uncertain in-flight requests carefully.",
    ],
    "Doubling application servers does not double the capacity of a saturated database.",
    q(
      "A note is stored only in server A’s memory. The next request goes to B. What is wrong?",
      ["B may not have the note", "The database has too many copies", "Load balancing guarantees the note appears"],
      0,
      [
        "Yes. Share durable state outside individual application processes.",
        "The example has not stored the note in the database at all.",
        "Routing does not replicate application memory.",
      ]
    ),
    "Draw a two-server notes service. Show where sign-in is verified, where notes live, and what happens if one server stops.",
    ["Both servers use shared durable state.", "Either server can verify a session.", "I considered health checks and in-flight failure."],
    "Browser → load balancer → either application server → database. Both servers verify the session and enforce note ownership. Remove an unhealthy server from routing. Retry reads safely; for writes, use a safe retry contract. The database and load balancer also need their own reliability plans.",
    ["Load balancer", "Server A or B", "Shared database"],
    ["roadmap", "patterns"],
    "capacity"
  ),
  lesson(
    "cache",
    1,
    "Keep a nearby copy of repeated reads",
    "A cache saves work by reusing an answer you already fetched.",
    [
      "Many students read the same public lesson. Instead of rebuilding it each time, keep a reusable copy. A cache hit finds that copy. A miss must fetch the answer from the source.",
      "A copy can become stale when the source changes. Choose an expiry time or invalidation plan. For private data, include the right identity in the cache key and check access. A cache is usually not the only durable copy.",
    ],
    [
      "Ask the cache for lesson:42:version:3.",
      "On a hit, return the reusable lesson.",
      "On a miss, read the source and fill the cache.",
      "When publishing a new version, change the version key or invalidate the old entry.",
    ],
    "A shared cache key such as ‘my-notes’ can leak one learner’s notes to another.",
    q("1,000 requests arrive. A 90% hit rate means how many misses?", ["900", "100", "10"], 1, [
      "900 are hits, not misses.",
      "Yes. Ten percent of 1,000 requests miss the cache.",
      "Ten percent means 100 out of 1,000.",
    ]),
    "Choose what to cache in a notes app: public lesson text or a private ‘my notes’ response. Describe the key, expiry, and stale-data risk.",
    ["I specified a cache key and access scope.", "I explained expiry or invalidation.", "I kept a durable source of truth."],
    "Start with public lesson text under a versioned lesson key. A source database or content file remains authoritative. Updating the version gives new reads a new key. Caching private notes is possible, but it needs account-scoped keys, authorization, and a stricter freshness plan.",
    ["Read", "Cache hit?", "Source on a miss"],
    ["cache"],
    "cache"
  ),
  lesson(
    "cdn",
    1,
    "Deliver large files from nearer the reader",
    "A CDN keeps reusable content at locations closer to users.",
    [
      "A content delivery network, or CDN, can serve images, scripts, and videos from nearby locations. This can reduce network travel and origin traffic.",
      "Object storage keeps files as named objects. Store file metadata in a database and file bytes in suitable object storage. A CDN can sit in front of the file origin. Private files still need access controls; putting a CDN in front does not make them safe.",
    ],
    [
      "Upload an illustration into object storage.",
      "Store its object key and ownership in the database.",
      "Serve a public, versioned illustration through a CDN.",
      "When it changes, use a new versioned URL so old caches do not hide the update.",
    ],
    "Long cache lifetimes on a filename that never changes can leave learners seeing old content.",
    q(
      "A public illustration changes. Which plan makes the new version easy to cache safely?",
      ["Keep an eternal cached URL and hope", "Put all images in every database row", "Publish a new versioned URL"],
      2,
      [
        "Clients may keep the previous file until it expires.",
        "Duplicating file bytes into unrelated records creates other problems.",
        "Yes. A new content version can use a new cache key or URL.",
      ]
    ),
    "Describe storage and delivery for public lesson diagrams and private student attachments. Explain the access difference.",
    ["I separated file bytes from metadata.", "I distinguished public and private content.", "I included a cache update plan."],
    "Store file bytes in object storage and metadata in a database. Public diagrams use versioned URLs and a CDN. For private attachments, verify ownership and use a controlled download flow such as short-lived signed URLs with appropriate cache policy. Do not expose a public permanent URL by accident.",
    ["Reader", "Nearby CDN copy", "File origin"],
    ["cache", "security"]
  ),
  lesson(
    "retry",
    1,
    "A lost reply does not mean nothing happened",
    "Retry safely by recognizing the same operation when it arrives again.",
    [
      "A reservation may succeed even if its response never reaches the phone. Retrying blindly can create a duplicate.",
      "Give one intended operation a stable request key. The server records the key and outcome so a retry can return the original result. This is an idempotency design: repeating the operation does not repeat its effect. Bound retries, add delays, and spread their timing with jitter so they do not overload a struggling service.",
    ],
    [
      "The phone sends create-reservation with key booking-123.",
      "The server atomically records the reservation and key outcome.",
      "The reply is lost, so the phone retries with booking-123.",
      "The server returns the existing result. A reused key with a different payload is rejected.",
    ],
    "Generating a new key on every retry turns retries into new operations.",
    q(
      "A booking reply times out. Which statement is safe?",
      ["The outcome is unknown; retry with the same operation key", "The booking definitely failed", "Repeat forever with a new key"],
      0,
      [
        "Yes. A timeout limits waiting; it does not prove the server made no change.",
        "The server may have committed before the reply was lost.",
        "This can create duplicates and amplify overload.",
      ]
    ),
    "Write a retry contract for creating a reservation. Include key scope, duplicate behavior, and when to stop retrying.",
    ["One operation keeps the same key.", "Deduplication and the effect are coordinated durably.", "I bounded retries and handled unknown outcomes."],
    "Scope a client-generated operation key to the authenticated user. Store the request fingerprint and result with the reservation atomically. A matching retry gets the stored result; conflicting payloads are rejected. Use a deadline, limited attempts, backoff, and jitter. Document how long keys are retained; retry safety has that boundary.",
    ["One operation key", "Durable duplicate check", "Original result"],
    ["idempotency", "retries"]
  ),
  lesson(
    "queues",
    2,
    "Let slow work happen after the reply",
    "A queue holds work until a worker is ready to do it.",
    [
      "Booking a seat should not wait for an email provider. Save the booking first and arrange for a worker to send the notification later.",
      "A durable queue can absorb a burst, but it does not make workers faster. Messages may be delivered more than once. Make effects safe to repeat. To avoid saving a booking but losing its notification job, a common pattern writes an outbox record in the booking transaction; a dispatcher later publishes it.",
    ],
    [
      "In one transaction, save the reservation and an outbox event.",
      "A dispatcher publishes the event to a durable queue.",
      "A worker sends the notification and acknowledges completed work.",
      "If it crashes before acknowledging, the job may return. Handle that duplicate safely.",
    ],
    "‘Put it on a queue’ does not guarantee exactly one email or that a backlog will ever drain.",
    q(
      "Jobs arrive at 10/second, but workers finish 6/second. What happens under sustained load?",
      ["The queue automatically becomes faster", "The backlog grows by about 4 jobs/second", "The backlog stays empty"],
      1,
      [
        "A queue stores excess work; it does not create processing capacity.",
        "Yes. More work arrives than leaves.",
        "Workers cannot keep up in this example.",
      ]
    ),
    "Design a reliable booking confirmation flow. Include the gap between database commit and queue publish, worker crashes, and duplicate delivery.",
    ["I handled the database-to-queue gap.", "I considered duplicate effects.", "I track backlog or oldest-job age."],
    "Save the booking and outbox event in one transaction. Publish outbox events with retry. Workers track event IDs and use provider deduplication where available. Acknowledge after durable completion. If sending succeeds but recording it fails, duplicates remain possible unless the provider supports a safe idempotency contract. Monitor oldest-job age and failed jobs.",
    ["Booking + outbox", "Queue", "Notification worker"],
    ["queues", "idempotency", "patterns"],
    "queue"
  ),
  lesson(
    "replication",
    2,
    "Make a copy, then ask how current it is",
    "Replication keeps copies of data on different servers.",
    [
      "One database may accept writes while replicas follow its changes. Replicas can serve some reads or be candidates for failover.",
      "Asynchronous copying lets the writer reply before a replica catches up. That can give stale reads and possible loss of recent writes after failure. Waiting for another copy can improve durability guarantees but adds delay and may block when that copy is unreachable. Backups are still needed: replicas can copy a deletion too.",
    ],
    [
      "The primary saves note version 8.",
      "It replies before an asynchronous replica receives version 8.",
      "A read from that replica can still return version 7.",
      "After it catches up, the replica returns version 8.",
    ],
    "A replica is not a backup history and is not automatically up to date.",
    q(
      "You delete a row accidentally, and that delete is replicated. What would help recover the old row?",
      ["A suitable tested backup and recovery history", "Assuming every replica kept the old row", "Adding a load balancer"],
      0,
      [
        "Yes. Recovery needs retained history, not just live copies.",
        "Replicas normally apply deletions too.",
        "Traffic routing does not recover deleted data.",
      ]
    ),
    "Choose a read plan for public lesson descriptions and freshly saved private notes. Explain replica lag and recovery.",
    ["I considered stale reads.", "I distinguished replication and backups.", "I stated a failover durability limitation."],
    "A public description may tolerate a brief stale read from a replica. After saving a private note, route that user’s read to a source that guarantees their write is visible, or wait for a known version. Keep tested backups. Asynchronous failover may lose writes not yet copied; document acceptable recovery limits.",
    ["Write to primary", "Copy changes", "Read replica"],
    ["replication"]
  ),
  lesson(
    "consistency",
    2,
    "Decide when an older answer is acceptable",
    "Different operations can need different promises about freshness.",
    [
      "A public like count can often be slightly behind. Showing an old reservation status immediately after a successful booking is more confusing. Confirming two people into the last seat is a correctness failure.",
      "Eventual consistency means copies should converge when updates stop and communication and processing succeed. It does not specify ‘within one second’ by itself. Stronger guarantees may require coordination. Choose a promise per operation, rather than calling the whole app simply consistent or inconsistent.",
    ],
    [
      "A lesson gets one new like.",
      "A nearby copy still shows 99 while the writer shows 100.",
      "That delay is acceptable for this public counter.",
      "Use coordinated seat claims for booking; do not use that stale counter to decide the last seat.",
    ],
    "The ‘consistency’ in database ACID and the freshness guarantees of distributed reads describe different concerns.",
    q(
      "Which operation most needs a coordinated correctness decision?",
      ["Displaying a slightly old public like count", "Claiming the final seat", "Showing a cached lesson illustration"],
      1,
      [
        "This can often tolerate delay.",
        "Yes. Two independent stale checks can oversell the seat.",
        "A versioned illustration can often tolerate caching.",
      ]
    ),
    "For a study app, label a public count, a saved note, and a seat claim with the freshness or correctness promise each needs.",
    ["I chose promises per operation.", "I explained why one may tolerate delay.", "I used coordination where correctness requires it."],
    "A public view count may converge later. A user reading their own saved note needs a read-your-writes plan. A last-seat claim needs coordinated enforcement. ‘Eventual’ alone promises no fixed delay; add and measure a separate freshness target if the product needs one.",
    ["Write", "Copies catch up", "Promise per operation"],
    ["consistency", "replication"]
  ),
  lesson(
    "partitions",
    2,
    "What if two sides cannot talk?",
    "When copies lose contact, some guarantees cannot all be kept.",
    [
      "A network partition means parts of a system cannot exchange the messages they need. Both sides may still receive requests from users.",
      "For a shared record, you cannot guarantee both a single up-to-date order of operations and a successful response to every request at reachable nodes throughout such a split. This is the tension behind CAP. It is not an everyday instruction to ‘pick any two’ features. A booking service can refuse uncertain writes; a public counter may accept temporary disagreement.",
    ],
    [
      "Two locations cannot communicate. Each last saw one seat remaining.",
      "A student asks each location for that final seat.",
      "If both independently confirm, the system can overbook.",
      "Use an authority or coordinated rule; a side unable to establish the claim must reject or delay it.",
    ],
    "A timeout does not reveal whether the other side is dead or merely unreachable.",
    q(
      "During a split, two isolated nodes both confirm the same last seat. Which promise was broken?",
      ["The ability to render HTML", "The ability to cache images", "The single-seat correctness rule"],
      2,
      [
        "Rendering is unrelated to this conflict.",
        "Image caching does not enforce seat ownership.",
        "Yes. Keeping both sides accepting independent claims can violate the rule.",
      ]
    ),
    "Explain what your booking service shows when it cannot reach the authority for the last seat. Compare that with a public view counter.",
    ["I described an actual communication failure.", "I kept the seat rule explicit.", "I explained the availability trade-off."],
    "Return ‘We cannot confirm this seat yet; try again’ rather than a false confirmation. A view counter might accept local increments and reconcile them later with a suitable merge rule. These choices apply to specific operations under a stated failure, not a universal product label.",
    ["Location A", "Network link broken", "Location B"],
    ["cap", "consistency"]
  ),
  lesson(
    "sharding",
    2,
    "Split data only when you know the pressure",
    "Sharding puts different records on different storage nodes.",
    [
      "Replication copies the same data. Sharding divides different data. For example, one shard might own some students and another shard the rest.",
      "A shard key decides placement. A good choice spreads the busy work and supports common queries. Hashing a student ID can distribute users, but one very busy user can still overload one shard. Cross-shard queries, transactions, and moving data become harder. Measure and optimize before adding that complexity.",
    ],
    [
      "Choose student_id as a possible key for private notes.",
      "Map IDs to shards using a stable routing plan.",
      "Send a student’s note reads and writes to their assigned shard.",
      "Check hot users, shard growth, migration, and queries spanning many students.",
    ],
    "A balanced number of rows does not guarantee balanced traffic.",
    q(
      "One celebrity’s account receives half of all reads. What can still happen after sharding by user?",
      ["That user’s shard can become hot", "Traffic must be perfectly balanced", "Replication and sharding become identical"],
      0,
      [
        "Yes. Placement must consider workload, not just record counts.",
        "One busy key can dominate a shard.",
        "Copies and partitions solve different problems.",
      ]
    ),
    "Suggest a key for private notes. Explain one query it makes easy and one query it makes harder. State what would justify sharding.",
    ["I stated a key and access pattern.", "I considered a hot key or cross-shard operation.", "I named evidence needed before sharding."],
    "Student ID keeps one person’s notes together. Reading that student’s notes is straightforward. Searching all students’ notes needs a cross-shard plan and strict authorization. Consider sharding only after measured database limits remain despite query, index, and capacity improvements.",
    ["Routing by key", "Shard A: some records", "Shard B: other records"],
    ["patterns", "roadmap"]
  ),
  lesson(
    "limits",
    2,
    "Protect a service from too much work",
    "A rate limit bounds how much work a caller can start in a period.",
    [
      "A token bucket is one way to limit requests. It holds a maximum number of tokens, refills at a chosen rate, and spends one token per allowed request. The bucket size permits a short burst.",
      "A shared limit needs coordinated state if requests reach different application servers. Choose the key carefully: an IP address can represent many legitimate people. Return a useful overload response and monitor rejection rates. Rate limits do not replace authorization or capacity planning.",
    ],
    [
      "The bucket holds up to 5 tokens and refills 1 per second.",
      "Five immediate requests spend all 5 tokens.",
      "A sixth immediate request must wait or be rejected.",
      "After one second, 1 token is available again, assuming no intervening requests.",
    ],
    "Five servers each enforcing a local limit of 10 do not produce a global limit of 10.",
    q("A full 5-token bucket refills at 1/second. Six requests arrive at once. How many can immediately pass?", ["6", "5", "1"], 1, [
      "Only five tokens are available initially.",
      "Yes. Capacity allows a burst of five; refill matters over time.",
      "One per second is the refill rate, not the initial burst capacity.",
    ]),
    "Design a limit for creating study groups. Name the key, burst size, refill rate, and what the user sees when limited.",
    ["I specified a burst and sustained rate.", "I considered multiple app servers.", "I described a useful rejection response."],
    "Use a verified account key, with a burst of 3 creations and refill of 1 per minute as an example policy. Coordinate token updates across servers. Return 429 with retry guidance. Monitor abuse and legitimate demand before choosing real limits; also protect expensive unauthenticated entry points.",
    ["Caller", "Shared token bucket", "Allow or slow down"],
    ["patterns", "retries"]
  ),
  lesson(
    "authorization",
    3,
    "Signing in is only the first check",
    "Identity says who you are. Authorization says which records you may use.",
    [
      "A signed-in student is still not allowed to read another student’s private notes. Check permission for every object on every relevant operation.",
      "Derive identity from a verified session. Filter reads and writes by ownership or a deliberate sharing rule. Database row policies can add protection. Keep privileged keys on trusted servers. Never treat a hidden button or hard-to-guess ID as an access control.",
    ],
    [
      "Student A sends GET /notes/500.",
      "The server verifies A’s session.",
      "It checks that note 500 belongs to A or is explicitly shared with A.",
      "If the check fails, do not return the note. Apply equivalent checks to updates and downloads.",
    ],
    "Changing a URL’s record ID must not be enough to read someone else’s data.",
    q(
      "A signed-in learner changes a note ID to someone else’s. What should protect the note?",
      ["A hidden edit button", "A long but public record ID", "A server or database ownership check"],
      2,
      [
        "Requests can bypass the interface.",
        "Hard-to-guess IDs are not a permission system.",
        "Yes. Verify identity and permission for the requested record.",
      ]
    ),
    "Write an access rule for private notes and a deliberately shared study-group note. Cover reads and updates.",
    [
      "I derived identity from a verified session.",
      "I checked access per record and operation.",
      "I separated private ownership and explicit sharing.",
    ],
    "Private notes allow only the owner to read or update. A shared group note allows reads to current group members; updates require an editor role. Enforce both rules on the server or through correctly configured database policies. Re-check access for attachment downloads and after membership changes.",
    ["Verified identity", "Object + permission", "Allowed data only"],
    ["security"]
  ),
  lesson(
    "operations",
    3,
    "Make a failure explain itself",
    "Good signals help you find which part of a user’s request went wrong.",
    [
      "Metrics show trends such as errors, latency, and queue age. Logs record individual events. Traces connect work across components using a request or trace ID.",
      "Start with the user outcome: can students save and retrieve a note? Alert on meaningful failures. Keep passwords, tokens, and private note text out of logs. Backups only help if restoration works; test recovery and state how much data or downtime the product can tolerate.",
    ],
    [
      "A note-save request receives request ID r42.",
      "The application records a database timeout under r42, without the private note body.",
      "A dashboard shows rising save failures and slow database calls.",
      "The team checks the failing dependency, mitigates the issue, and verifies saves work again.",
    ],
    "A green CPU dashboard does not prove users can save their work.",
    q(
      "Which signal most directly tells you users cannot save notes?",
      ["The failure rate of eligible save requests", "The color of the server icon", "The number of source files"],
      0,
      [
        "Yes. Measure the operation people depend on.",
        "A visual badge can hide a broken user flow.",
        "Repository size does not measure service health.",
      ]
    ),
    "Write a tiny operations plan for saved notes: one target, two signals, an alert, and a restore check.",
    ["I measured a user-visible operation.", "I avoided sensitive log content.", "I included recovery verification."],
    "Track successful saves and p95 save latency over a stated window. Alert on sustained save failures, using a policy appropriate to the service target. Correlate errors with request IDs. Restore a backup into an isolated environment and confirm sample notes and ownership rules before trusting recovery.",
    ["User outcome", "Metrics + logs + traces", "Alert → investigate"],
    ["slo", "replication"]
  ),
  lesson(
    "realtime",
    3,
    "Choose how the browser hears about changes",
    "Pick the simplest update method that meets the freshness need.",
    [
      "Polling asks repeatedly: ‘anything new?’ Server-sent events stream updates from server to browser. WebSockets support messages in both directions over a long-lived connection.",
      "A live connection can disappear. Reconnect with a marker showing the last event received and fetch missed durable events. An open socket is not message storage. Authorize subscriptions and individual operations, and plan how multiple servers route updates.",
    ],
    [
      "A browser reads messages up to conversation sequence 80.",
      "A connection streams messages 81 and 82.",
      "The connection drops before 83 arrives.",
      "On reconnect, ask for messages after 82, then resume updates with a race-safe handoff or deduplication.",
    ],
    "Choosing WebSockets does not guarantee delivery, ordering across writers, or persistence.",
    q(
      "A chat socket drops. What helps recover missed messages?",
      ["Only the old socket object", "Stored messages plus a resume marker", "Assuming the browser saw everything"],
      1,
      [
        "The disconnected socket cannot replay messages by itself.",
        "Yes. Persist messages and recover after the last acknowledged position.",
        "Network failure can interrupt delivery.",
      ]
    ),
    "Choose polling, server-sent events, or WebSockets for booking status updates. Explain your freshness need and reconnect plan.",
    ["The transport fits the actual update need.", "I used durable data for recovery.", "I included subscription authorization."],
    "For an occasional booking status change, modest polling can be sufficient. If immediate one-way updates matter, consider server-sent events. After reconnecting, fetch the authoritative status; do not rely on the connection as storage. Verify the viewer owns the booking.",
    ["Browser connection", "Update service", "Durable event history"],
    ["http", "patterns"]
  ),
  lesson(
    "boundaries",
    3,
    "Split responsibilities before splitting deployments",
    "Separate services when the benefits justify the extra coordination.",
    [
      "A modular monolith keeps clear internal boundaries in one deployable application. For a small team, that can keep changes and debugging manageable.",
      "Separate services can help teams deploy independently or scale distinct work. They also add network failures, authentication between services, and harder cross-service changes. A worker can be separate without turning every feature into a microservice. Choose boundaries around ownership and data, not every noun in the product.",
    ],
    [
      "Start with modules for booking, accounts, and notifications.",
      "Keep booking invariants and database ownership clear.",
      "Run slow notification work in a worker when needed.",
      "Split further only when measured load or team ownership makes a clear case.",
    ],
    "A service per database table can turn a simple update into many fragile network calls.",
    q(
      "A small team has little traffic and changes features together. Which is a reasonable starting point?",
      ["Fifty services by default", "A separate service for every column", "A well-structured application with clear modules"],
      2,
      [
        "Extra deployments add coordination without a stated benefit.",
        "Columns are not useful default service boundaries.",
        "Yes. Simplicity is a valid design choice under these assumptions.",
      ]
    ),
    "Choose an initial deployment structure for a two-person booking app. Name one concrete trigger for separating a component later.",
    ["My choice reflects the team and workload.", "I kept ownership and responsibilities clear.", "I named a measurable or organizational trigger."],
    "Start with one application divided into booking, account, and notification modules, plus a worker if email is slow. Keep seat rules together. Split notification delivery if its workload, failure isolation, or team ownership warrants independent operation. Document the new failure and data-consistency boundaries.",
    ["Clear modules", "One app + useful worker", "Split when justified"],
    ["simplicity"]
  ),
  lesson(
    "search",
    3,
    "Build a view made for finding things",
    "A search index is a derived view, not usually the original record.",
    [
      "Looking up a lesson by ID and searching for ‘shortest path’ are different tasks. A search index can map words to matching lessons.",
      "Copy relevant changes into the index through a reliable update flow. It can lag behind the source. Plan how to rebuild it and how to remove deleted content. Private search must enforce access too: a result title or snippet can leak information even if the full document is protected.",
    ],
    [
      "Save a published lesson in the authoritative store.",
      "Send its updated searchable fields to an index.",
      "Search matches terms against that derived view.",
      "Open the result from the source and rebuild the index if necessary.",
    ],
    "An eventually updated index may still show a deleted or newly private record unless your read path enforces access.",
    q(
      "Your search index is lost, but the source lessons remain. What should a good design allow?",
      ["Rebuild the index from the source", "Declare all original lessons deleted", "Use search as the only backup"],
      0,
      [
        "Yes. A derived view should have a recovery path.",
        "Losing a copy does not remove intact source records.",
        "An index is not a substitute for source backups.",
      ]
    ),
    "Design search for public lessons. Explain indexing, update lag, deletion, and rebuilding.",
    ["I identified the authoritative source.", "I considered updates and deletions.", "I included a rebuild plan."],
    "Store lessons durably, then maintain a word-to-lesson index. Use reliable change delivery or periodic reconciliation. Treat search as a potentially stale view; filter unpublished results. Rebuild from published source lessons if the index is corrupted. Start with database search if it meets the actual workload.",
    ["Source records", "Update index", "Searchable view"],
    ["cap", "consistency"]
  ),
  lesson(
    "regions",
    3,
    "Distance, recovery, and the cost of copies",
    "Put data in more places only with a clear freshness and recovery plan.",
    [
      "A distant server adds network travel. Nearby content copies can help reads. Writes across regions are harder because coordination takes time and links fail.",
      "Recovery point objective, or RPO, is the amount of data loss you can tolerate, expressed as time. Recovery time objective, or RTO, is how long restoration may take. These are targets you must test. Estimate storage copies, transfer, request volume, and operational effort before multiplying regions.",
    ],
    [
      "A study app starts in one region with backups.",
      "A CDN serves public files near readers.",
      "Define a sample recovery target: lose at most 5 minutes of writes, recover within 1 hour.",
      "Test backup and failover procedures. Do not promise those numbers merely because a replica exists.",
    ],
    "More regions can increase cost and failure complexity; they do not automatically provide zero data loss.",
    q("A team can tolerate at most 5 minutes of data loss. Which target is this?", ["RTO", "RPO", "Requests per second"], 1, [
      "RTO is the tolerated recovery duration.",
      "Yes. RPO describes tolerated data loss as a time window.",
      "Traffic rate describes a different concern.",
    ]),
    "For a small personal learning app, choose a region and recovery approach. Include what you would measure before adding a second active region.",
    ["I stated recovery targets as targets.", "I included testing and copy costs.", "I justified extra regions with a real need."],
    "Start with one appropriate region and tested backups. Use a CDN for public static files. State achievable recovery targets after testing restore time and backup age. Add an active region only for a measured latency, availability, or locality requirement with an explicit write-conflict and cost plan.",
    ["Primary region", "Copies + backups", "Tested recovery"],
    ["replication", "slo"]
  ),
];

// Each studio applies the same method to a different constraint. These are reference designs, not unique answers.
const studios = [
  [
    "short-links",
    "Design a short-link service",
    "Make redirects fast without losing the mapping.",
    "Users create short links and follow them. Assume 10 new links/second and 1,000 redirects/second at peak. Links are public; private analytics and custom domains are out of scope.",
    [
      "API: POST /links returns a short code; GET /{code} looks it up and redirects.",
      "Store code → destination durably. Enforce code uniqueness and handle collisions.",
      "Cache popular mappings. Use an expiry or invalidation plan for edits and deletions.",
      "Protect link creation from abuse. Track redirect errors and latency, and decide how expired links respond.",
    ],
    "Random codes can collide. Probability being small does not replace a uniqueness check.",
    q(
      "A generated short code already exists. What should creation do?",
      ["Overwrite the previous destination", "Enforce uniqueness and generate another code", "Return a random existing link"],
      1,
      [
        "That would break somebody else’s link.",
        "Yes. Detect the collision and retry with a bounded, safe creation flow.",
        "A valid response must point to the requested destination.",
      ]
    ),
    "Design this service. Cover requirements, rough read/write load, APIs, mapping storage, collisions, caching, and one failure. Then adapt it for editable links.",
    [
      "I handled code uniqueness without overwriting.",
      "I traced creation and redirect separately.",
      "I explained invalidation and one failure mode.",
    ],
    "Begin with one application and a database table with a unique code key. Generate a code and retry a uniqueness conflict. Cache popular public mappings. At 1,000 redirects/second, measure hit rate and database misses before scaling. An edit must expire or replace cached data. If the cache fails, protect the database from a sudden miss surge; show a controlled error if capacity is exhausted.",
    ["Browser", "Redirect app + cache", "Unique mapping store"],
    ["indexes", "cache", "framework"],
  ],
  [
    "notifications",
    "Design a notification service",
    "Deliver useful messages while handling retries and duplicates.",
    "A booking service emits 100 confirmation jobs/second at peak. Delivery may take up to a minute. Some recipients opt out of optional reminders; essential booking status remains visible in the app.",
    [
      "Write a booking event through an outbox so a committed booking does not lose its job.",
      "Put events in a durable queue; scale workers based on processing rate and oldest-job age.",
      "Track an event-recipient-channel key. Use provider idempotency where available.",
      "Retry transient failures with limits and jitter. Retain failed jobs for investigation without retrying forever.",
    ],
    "No local ‘sent’ flag can by itself guarantee exactly one external send across every crash point.",
    q(
      "The email provider accepts a message, then your worker crashes before recording success. What is the risk?",
      ["A retry can send a duplicate", "The original booking must disappear", "A queue proves delivery happened once"],
      0,
      [
        "Yes. Coordinate with provider idempotency or explicitly accept and manage that residual risk.",
        "Notification failure should not erase a confirmed booking.",
        "Queue delivery and external message effects are separate guarantees.",
      ]
    ),
    "Design a notification pipeline. Include opt-out checks, a retry budget, duplicate handling, failed jobs, and the metric that shows users are waiting.",
    [
      "I handled the provider-success/crash gap.",
      "I included delivery preferences and retry limits.",
      "I measured oldest-job age or end-to-end delay.",
    ],
    "Use outbox → queue → workers → provider. Check current channel preferences for optional messages. Deduplicate by event, recipient, and channel, and pass a provider-supported idempotency key. Acknowledge after recording the outcome. Bound retries and move persistent failures aside for inspection. Track end-to-end delay, provider errors, and oldest pending job. Be explicit if exactly-once external effects cannot be guaranteed.",
    ["Outbox", "Queue + workers", "Provider + delivery record"],
    ["queues", "idempotency", "retries"],
  ],
  [
    "uploads",
    "Design a file upload service",
    "Large bytes and private metadata need different paths.",
    "Students upload private PDFs up to 20 MB. Uploads may be interrupted. Other students must not download the files. Public file sharing is out of scope.",
    [
      "The API verifies identity, file limits, and quota, then creates an upload record.",
      "Issue narrowly scoped, short-lived upload permission for an object key.",
      "The client uploads bytes to storage. Validate completion; scan and check actual file properties before marking usable.",
      "Authorize every download. Clean abandoned objects and records with a safe reconciliation process.",
    ],
    "A filename extension or a client’s ‘upload finished’ message does not prove the stored file is safe or complete.",
    q(
      "The browser says its upload is complete. What should happen before the file becomes usable?",
      ["Make the whole storage bucket public", "Trust the filename", "Verify the stored object and required validation"],
      2,
      [
        "That would expose private content.",
        "Names do not prove content type or integrity.",
        "Yes. Confirm storage state and validation before publishing the usable status.",
      ]
    ),
    "Design private uploads, including metadata, byte storage, interrupted uploads, validation, downloads, and abandoned-file cleanup.",
    ["I separated bytes and metadata.", "I used narrow access and verified completion.", "I included incomplete uploads and cleanup."],
    "Keep an upload record with owner, object key, size limit, and pending status. Grant temporary upload access to only that key. Support resumable or multipart uploads if needed. Verify final size and validation or scan result, then mark usable. Authorize private downloads before issuing short-lived access. Reconcile abandoned uploads after a grace period; keep cleanup from racing active uploads.",
    ["Authorized upload API", "Private object storage", "Validation worker"],
    ["security", "cache", "queues"],
  ],
  [
    "chat",
    "Design a small group chat",
    "Messages need durable history as well as a live connection.",
    "Study groups need text chat for up to 20 members each. Messages should usually appear within a second. Users may disconnect and return. Global ordering across unrelated groups is unnecessary.",
    [
      "Verify group membership on sends and history reads.",
      "Persist each accepted message with a stable ID and a defined per-conversation ordering strategy.",
      "Push new messages to connected members. Acknowledge durable acceptance separately from recipient delivery.",
      "On reconnect, fetch messages after the last received position. Deduplicate repeated sends and replayed messages.",
    ],
    "A socket send succeeding does not prove that a recipient stored or even saw the message.",
    q(
      "A user reconnects after missing five messages. Which design recovers them?",
      ["Keep messages only in socket memory", "Store history and resume after a known position", "Start a new conversation automatically"],
      1,
      [
        "Memory on the disconnected path is not durable history.",
        "Yes. Replay from durable history and reconcile with live delivery.",
        "A reconnect should not destroy conversation continuity.",
      ]
    ),
    "Design group chat. Cover membership, send retries, persistence, ordering scope, live delivery, and reconnect races.",
    ["I separated acceptance, delivery, and reading.", "I defined ordering per conversation.", "I explained replay and duplicate handling."],
    "Use a membership-checked API and durable messages with per-conversation sequence positions. Assign one stable client message ID per intended send. Persist and deduplicate before acknowledging acceptance. Stream new messages through an update service. Reconnect with a stored position and overlap replay with deduplication so events in the handoff are not lost. Read receipts, if added, are a separate feature.",
    ["Members", "Chat API + live updates", "Ordered durable history"],
    ["idempotency", "security", "patterns"],
  ],
  [
    "feed",
    "Design a learning activity feed",
    "Move work to the write path or the read path for a reason.",
    "Learners follow other learners’ public posts. Most have 50 followers; a few have 100,000. Start with a time-ordered feed, not a recommendation model. Private notes never appear.",
    [
      "Store posts and follows with explicit visibility rules.",
      "For ordinary accounts, consider adding post references to followers’ feed views when publishing.",
      "For very popular authors, consider merging recent posts when a follower reads instead of writing 100,000 copies immediately.",
      "Use stable pagination, reconcile deletes and visibility changes, and rebuild derived feeds from source data.",
    ],
    "A precomputed feed can still contain a reference to a deleted or newly private post. Check visibility at read time as needed.",
    q(
      "A popular author has 100,000 followers. What is a cost of copying a reference to every feed on each post?",
      ["A large burst of write work", "No extra work", "Automatic perfect privacy"],
      0,
      [
        "Yes. Fan-out on write can move a large cost to publication.",
        "Every destination needs an update.",
        "Visibility changes and deletion still need explicit handling.",
      ]
    ),
    "Design a chronological feed for this uneven follower distribution. Compare write-time fan-out, read-time merging, and a mixed approach.",
    ["I explained where the work happens.", "I considered unusually popular authors.", "I handled privacy changes and stable pagination."],
    "Start with a simple query if workload permits. As measured demand grows, precompute ordinary-author feed references and merge selected popular-author posts on read. This reduces some write bursts but increases read work. Use a cursor with time and a unique tie-breaker. Treat feed entries as derived references, enforce visibility, and retain a rebuild path.",
    ["Posts + follows", "Derived feed or read merge", "Authorized page"],
    ["patterns", "consistency", "security"],
  ],
  [
    "booking",
    "Design a booking system you can defend",
    "Keep the last-seat rule true through races, retries, and failures.",
    "Students book limited seats in study sessions. Peak traffic is 50 booking requests/second. A booking must never oversell seats. Payment processing and seat selection are out of scope.",
    [
      "Define APIs, authentication, and stable booking operation keys.",
      "In one transaction, atomically claim capacity, create the reservation, and record its outcome and outbox event.",
      "Retry safely after timeouts. Send confirmation asynchronously; the booking record remains authoritative.",
      "Monitor booking conflicts, failures, latency, and notification lag. Test concurrent last-seat claims and restoration.",
    ],
    "A cached seat count is useful for display, but it is not permission to confirm a booking.",
    q(
      "The email service is down after a seat was booked durably. What should the app report?",
      ["Booking failed, so create another one", "All seats are free again", "Booking confirmed; notification delivery is delayed"],
      2,
      [
        "That could duplicate a successful booking.",
        "Email failure does not reverse a committed seat claim.",
        "Yes. Keep the booking outcome distinct from the notification outcome.",
      ]
    ),
    "Write a complete design using the six notebook prompts. Defend your last-seat rule, unknown outcomes after timeouts, notification reliability, privacy, and recovery. Then change one assumption: demand rises by 100×.",
    [
      "I preserved the seat invariant under concurrency and retry.",
      "I separated durable booking and notification delivery.",
      "I explained a measured scaling and recovery plan.",
    ],
    "Use a booking application with a relational database. Verify the account, deduplicate by operation key, and atomically enforce capacity with reservation and outbox writes. Cache only display data. A worker handles confirmation. On timeout, retry the same key or query its outcome. At 100× demand, measure contention and processing capacity; add healthy app instances if they help, but do not split the seat authority casually. State backup, restore, and uncertainty limits. Multiple architectures are valid if they preserve the same stated rules.",
    ["Booking API", "Atomic seat + outcome + outbox", "Worker + notification"],
    ["transactions", "idempotency", "queues", "security"],
  ],
];
for (const [id, title, idea, brief, walk, pitfall, check, task, rubric, solution, diagram, sources] of studios)
  systemLessons.push(
    lesson(
      id,
      4,
      title,
      idea,
      [
        brief,
        "Work through the reference example, then close it and design your own version. State assumptions, trace a read and a write, and explain what fails. Your design may differ if you can defend the trade-offs.",
      ],
      walk,
      pitfall,
      check,
      task,
      rubric,
      solution,
      diagram,
      sources
    )
  );
systemLessons.forEach((l, index) => {
  l.position = index + 1;
  l.requires = index ? [systemLessons[index - 1].id] : [];
});
export const systemLessonById = Object.assign(Object.create(null), Object.fromEntries(systemLessons.map((l) => [l.id, l])));

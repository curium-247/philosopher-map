import { useState, useCallback, useRef, useEffect } from "react";

const philosophers = [
  // ── Pre-Socratic Origins ──
  { id:"heraclitus",  name:"Heraclitus",        dates:"535–475 BC",  cluster:"ancient",
    bio:"Claimed all reality is flux and fire; his paradox 'you cannot step into the same river twice' seeded dialectical thinking from Hegel to Nietzsche.", wiki:"https://en.wikipedia.org/wiki/Heraclitus" },
  { id:"parmenides",  name:"Parmenides",        dates:"515–450 BC",  cluster:"ancient",
    bio:"Argued that change is an illusion and only Being truly exists — a challenge Plato, Aristotle, and Hegel each had to wrestle with.", wiki:"https://en.wikipedia.org/wiki/Parmenides" },
  { id:"thucydides",  name:"Thucydides",        dates:"460–400 BC",  cluster:"ancient",
    bio:"Historian of the Peloponnesian War whose analysis of power and empire shaped political realism from Machiavelli to Foucault.", wiki:"https://en.wikipedia.org/wiki/Thucydides" },

  // ── Eastern Philosophy ──
  { id:"laozi",       name:"Laozi",             dates:"~6th c BC",   cluster:"eastern",
    bio:"Legendary author of the Tao Te Ching and founder of Daoism; teaches that the Way flows through effortless non-action (wu wei) — a philosophy of yielding that resonates in Heidegger's 'letting-be' and Deleuze's philosophy of flows.", wiki:"https://en.wikipedia.org/wiki/Laozi" },
  { id:"confucius",   name:"Confucius",         dates:"551–479 BC",  cluster:"eastern",
    bio:"China's most influential philosopher; his ethics of ritual propriety, filial piety, and benevolent governance (ren) shaped East Asian civilization for 2,500 years and now anchors global comparative philosophy.", wiki:"https://en.wikipedia.org/wiki/Confucius" },
  { id:"zhuangzi",    name:"Zhuangzi",          dates:"369–286 BC",  cluster:"eastern",
    bio:"Master of Daoist philosophy; his parables — the butterfly dream, the cook and the ox — teach effortless action and a radical relativism about knowledge that anticipates postmodern skepticism.", wiki:"https://en.wikipedia.org/wiki/Zhuangzi" },
  { id:"nagarjuna",   name:"Nāgārjuna",         dates:"150–250 AD",  cluster:"eastern",
    bio:"Founder of Mādhyamaka Buddhist philosophy; his doctrine of emptiness (sunyata) — that all phenomena lack inherent existence — is arguably the most rigorous metaphysical challenge to Western substance ontology.", wiki:"https://en.wikipedia.org/wiki/Nagarjuna" },
  { id:"nishida",     name:"Kitaro Nishida",    dates:"1870–1945",   cluster:"eastern",
    bio:"Japan's greatest modern philosopher; founded the Kyoto School by fusing Zen Buddhist insight with Western idealism, creating 'pure experience' as the ground of all knowledge.", wiki:"https://en.wikipedia.org/wiki/Kitaro_Nishida" },

  // ── Socratic / Ancient ──
  { id:"socrates",    name:"Socrates",          dates:"470–399 BC",  cluster:"ancient",
    bio:"Practiced philosophy as relentless questioning; his method of elenchus — exposing contradiction through dialogue — remains the foundational model of critical inquiry.", wiki:"https://en.wikipedia.org/wiki/Socrates" },
  { id:"plato",       name:"Plato",             dates:"428–348 BC",  cluster:"ancient",
    bio:"Founded the Academy and the theory of Forms; his dialogues set the agenda for nearly every major question in Western philosophy.", wiki:"https://en.wikipedia.org/wiki/Plato" },
  { id:"aristotle",   name:"Aristotle",         dates:"384–322 BC",  cluster:"ancient",
    bio:"Plato's student who grounded philosophy in empirical observation; his ethics of eudaimonia and virtue directly shaped Nussbaum, Sandel, MacIntyre, and McMullin.", wiki:"https://en.wikipedia.org/wiki/Aristotle" },
  { id:"hypatia",     name:"Hypatia",           dates:"360–415 AD",  cluster:"ancient",
    bio:"Mathematician and Neoplatonist philosopher in Alexandria; one of the first documented women in mathematics and philosophy, murdered for her commitment to rational inquiry.", wiki:"https://en.wikipedia.org/wiki/Hypatia" },

  // ── Stoic ──
  { id:"zeno",        name:"Zeno of Citium",    dates:"334–262 BC",  cluster:"stoic",
    bio:"Founder of Stoicism; taught that virtue alone is sufficient for happiness and that reason connects all living things.", wiki:"https://en.wikipedia.org/wiki/Zeno_of_Citium" },
  { id:"chrysippus",  name:"Chrysippus",        dates:"279–206 BC",  cluster:"stoic",
    bio:"Third head of the Stoic school; systematized Stoic logic and ethics so thoroughly that it was said: 'Without Chrysippus, there would be no Stoa.'", wiki:"https://en.wikipedia.org/wiki/Chrysippus" },
  { id:"seneca",      name:"Seneca",            dates:"4 BC–65 AD",  cluster:"stoic",
    bio:"Roman Stoic philosopher and dramatist whose Letters on Ethics are among the most personal philosophical texts in antiquity; his synthesis profoundly shaped Montaigne and Renaissance humanism.", wiki:"https://en.wikipedia.org/wiki/Seneca_the_Younger" },
  { id:"epictetus",   name:"Epictetus",         dates:"50–135 AD",   cluster:"stoic",
    bio:"Former enslaved person whose Enchiridion distilled Stoic practice: distinguish what is up to us from what is not, and freedom follows.", wiki:"https://en.wikipedia.org/wiki/Epictetus" },
  { id:"marcus",      name:"Marcus Aurelius",   dates:"121–180 AD",  cluster:"stoic",
    bio:"Roman emperor and Stoic; his Meditations — written as private self-counsel — became one of the most widely read philosophical texts ever produced.", wiki:"https://en.wikipedia.org/wiki/Marcus_Aurelius" },

  // ── Neoplatonic / Medieval ──
  { id:"plotinus",    name:"Plotinus",          dates:"204–270 AD",  cluster:"medieval",
    bio:"Founder of Neoplatonism; his Enneads shaped Christian, Islamic, and Jewish mysticism and influenced Augustine, Avicenna, and the entire medieval synthesis.", wiki:"https://en.wikipedia.org/wiki/Plotinus" },
  { id:"augustine",   name:"Augustine",         dates:"354–430 AD",  cluster:"medieval",
    bio:"Synthesized Platonic philosophy with Christian theology; his concepts of will, original sin, and inner illumination structured Western thought for a millennium.", wiki:"https://en.wikipedia.org/wiki/Augustine_of_Hippo" },
  { id:"pizan",       name:"Christine de Pizan",dates:"1364–1430",   cluster:"medieval",
    bio:"Medieval poet and philosopher who wrote The Book of the City of Ladies (1405), one of the earliest sustained defenses of women's intellectual equality — five centuries before de Beauvoir.", wiki:"https://en.wikipedia.org/wiki/Christine_de_Pizan" },

  // ── Islamic Golden Age ──
  { id:"alfarabi",    name:"Al-Farabi",         dates:"872–950 AD",  cluster:"medieval",
    bio:"Called the 'Second Teacher' after Aristotle; synthesized Greek philosophy with Islamic thought and directly shaped Avicenna's entire philosophical project.", wiki:"https://en.wikipedia.org/wiki/Al-Farabi" },
  { id:"avicenna",    name:"Avicenna",          dates:"980–1037",    cluster:"medieval",
    bio:"Persian polymath whose 'floating man' thought experiment anticipated Descartes' cogito by six centuries; synthesized Aristotle with Islamic theology.", wiki:"https://en.wikipedia.org/wiki/Avicenna" },
  { id:"averroes",    name:"Averroes",          dates:"1126–1198",   cluster:"medieval",
    bio:"Called 'The Commentator' by Dante; his defense of Aristotle against theological censorship was pivotal for the European Renaissance and Aquinas's synthesis.", wiki:"https://en.wikipedia.org/wiki/Averroes" },
  { id:"hildegard",   name:"Hildegard of Bingen",dates:"1098–1179",  cluster:"medieval",
    bio:"Abbess, mystic, and natural philosopher whose visionary writings integrated body, spirit, and cosmos — a genuinely original voice in medieval thought.", wiki:"https://en.wikipedia.org/wiki/Hildegard_of_Bingen" },
  { id:"aquinas",     name:"Thomas Aquinas",    dates:"1225–1274",   cluster:"medieval",
    bio:"Synthesized Aristotle with Christian theology; his natural law theory remains foundational in Catholic moral philosophy and Sandel's communitarianism.", wiki:"https://en.wikipedia.org/wiki/Thomas_Aquinas" },
  { id:"ibn_khaldun", name:"Ibn Khaldun",       dates:"1332–1406",   cluster:"medieval",
    bio:"Arab historian and social theorist whose Muqaddimah (1377) invented sociology and philosophy of history; his concept of asabiyya (social cohesion) prefigures Durkheim, Marx, and Gramsci.", wiki:"https://en.wikipedia.org/wiki/Ibn_Khaldun" },

  // ── Early Modern ──
  { id:"erasmus",     name:"Erasmus",           dates:"1466–1536",   cluster:"earlymodern",
    bio:"Prince of the Christian humanists; his Praise of Folly bridged scholastic theology and Renaissance reason, clearing intellectual ground for Montaigne and the Reformation.", wiki:"https://en.wikipedia.org/wiki/Erasmus" },
  { id:"machiavelli", name:"Machiavelli",       dates:"1469–1527",   cluster:"earlymodern",
    bio:"Separated politics from morality in The Prince; his realism about power anticipates Foucault's genealogy of governance and the modern concept of raison d'état.", wiki:"https://en.wikipedia.org/wiki/Niccol%C3%B2_Machiavelli" },
  { id:"montaigne",   name:"Montaigne",         dates:"1533–1592",   cluster:"earlymodern",
    bio:"Invented the essay as radical self-examination; his skepticism and humanism shaped Descartes' method of doubt and Pascal's existential anxiety.", wiki:"https://en.wikipedia.org/wiki/Michel_de_Montaigne" },
  { id:"bacon",       name:"Francis Bacon",     dates:"1561–1626",   cluster:"earlymodern",
    bio:"Father of empiricism and the scientific method; Novum Organum replaced Aristotelian deduction with inductive experiment, laying the foundation for Locke, Hume, and the Enlightenment.", wiki:"https://en.wikipedia.org/wiki/Francis_Bacon" },
  { id:"hobbes",      name:"Hobbes",            dates:"1588–1679",   cluster:"earlymodern",
    bio:"Argued that without sovereign authority life is 'solitary, poor, nasty, brutish, and short'; his social contract theory is the dark twin of Locke's liberal version.", wiki:"https://en.wikipedia.org/wiki/Thomas_Hobbes" },
  { id:"descartes",   name:"Descartes",         dates:"1596–1650",   cluster:"rationalist",
    bio:"Father of modern philosophy; his method of radical doubt and mind-body dualism set the terms for every subsequent debate in epistemology and philosophy of mind.", wiki:"https://en.wikipedia.org/wiki/Ren%C3%A9_Descartes" },
  { id:"pascal",      name:"Pascal",            dates:"1623–1662",   cluster:"earlymodern",
    bio:"Mathematician and philosopher whose Pensées diagnosed human existence as suspended between misery and greatness; his Wager is a landmark of decision theory that shaped Kierkegaard's leap of faith.", wiki:"https://en.wikipedia.org/wiki/Blaise_Pascal" },
  { id:"spinoza",     name:"Spinoza",           dates:"1632–1677",   cluster:"rationalist",
    bio:"Radical pantheist who identified God with Nature; his monism profoundly shaped Hegel, Deleuze, and every thinker who sought a philosophy beyond dualism.", wiki:"https://en.wikipedia.org/wiki/Baruch_Spinoza" },
  { id:"locke",       name:"John Locke",        dates:"1632–1704",   cluster:"earlymodern",
    bio:"Argued that legitimate government rests on consent and natural rights; his empiricism and liberal politics are foundational for Rawls, Mill, and Wollstonecraft.", wiki:"https://en.wikipedia.org/wiki/John_Locke" },
  { id:"leibniz",     name:"Leibniz",           dates:"1646–1716",   cluster:"rationalist",
    bio:"Conceived reality as composed of indivisible 'monads'; his rationalist metaphysics made him a key bridge to Kant's critical project.", wiki:"https://en.wikipedia.org/wiki/Gottfried_Wilhelm_Leibniz" },
  { id:"voltaire",    name:"Voltaire",          dates:"1694–1778",   cluster:"earlymodern",
    bio:"The Enlightenment's most devastating satirist; Candide demolished Leibnizian optimism and his campaigns for tolerance shaped Rousseau's critique and Mill's liberalism.", wiki:"https://en.wikipedia.org/wiki/Voltaire" },
  { id:"hume",        name:"David Hume",        dates:"1711–1776",   cluster:"earlymodern",
    bio:"The most rigorous empiricist; his skepticism about causation and personal identity demolished rationalist metaphysics and famously woke Kant from his 'dogmatic slumber.'", wiki:"https://en.wikipedia.org/wiki/David_Hume" },
  { id:"rousseau",    name:"Rousseau",          dates:"1712–1778",   cluster:"earlymodern",
    bio:"Argued that natural humans are good and society corrupts; his concept of the general will shaped the French Revolution, Kant's ethics, and Wollstonecraft's feminism.", wiki:"https://en.wikipedia.org/wiki/Jean-Jacques_Rousseau" },
  { id:"adamsmith",   name:"Adam Smith",        dates:"1723–1790",   cluster:"earlymodern",
    bio:"Moral philosopher whose Wealth of Nations argues sympathy, self-interest, and markets together produce social order — a synthesis Marx devoted his life to dismantling.", wiki:"https://en.wikipedia.org/wiki/Adam_Smith" },
  { id:"kant",        name:"Kant",              dates:"1724–1804",   cluster:"rationalist",
    bio:"Synthesized rationalism and empiricism; his categorical imperative and critique of pure reason restructured epistemology, ethics, and aesthetics for all of modernity.", wiki:"https://en.wikipedia.org/wiki/Immanuel_Kant" },
  { id:"bentham",     name:"Jeremy Bentham",    dates:"1748–1832",   cluster:"earlymodern",
    bio:"Founder of utilitarianism — the greatest happiness of the greatest number; his panopticon design became the central exhibit in Foucault's Discipline and Punish.", wiki:"https://en.wikipedia.org/wiki/Jeremy_Bentham" },
  { id:"wollstonecraft",name:"Mary Wollstonecraft",dates:"1759–1797",cluster:"earlymodern",
    bio:"Author of A Vindication of the Rights of Woman (1792); argued that women's apparent irrationality was produced by oppressive education, not nature — a founding feminist text.", wiki:"https://en.wikipedia.org/wiki/Mary_Wollstonecraft" },

  // ── German Idealism & 19th c. ──
  { id:"hegel",       name:"Hegel",             dates:"1770–1831",   cluster:"german-idealism",
    bio:"Conceived history as Spirit's self-realization through dialectical conflict; arguably the most influential and most argued-with thinker in Western philosophy.", wiki:"https://en.wikipedia.org/wiki/Georg_Wilhelm_Friedrich_Hegel" },
  { id:"schopenhauer",name:"Schopenhauer",      dates:"1788–1860",   cluster:"german-idealism",
    bio:"Argued the world is driven by blind, irrational Will; his pessimism and aesthetics deeply influenced Nietzsche, Freud, Wittgenstein, and Borges.", wiki:"https://en.wikipedia.org/wiki/Arthur_Schopenhauer" },
  { id:"shelley",     name:"Mary Shelley",      dates:"1797–1851",   cluster:"earlymodern",
    bio:"Author of Frankenstein (1818), a philosophical novel interrogating the ethics of creation, Promethean ambition, and what constitutes humanity — proto-bioethics and proto-existentialism in one text.", wiki:"https://en.wikipedia.org/wiki/Mary_Shelley" },
  { id:"michelet",    name:"Michelet",          dates:"1798–1874",   cluster:"history",
    bio:"Romantic historian who saw 'the people' as history's true subject; his narrative method influenced emancipatory historians' understanding of collective agency.", wiki:"https://en.wikipedia.org/wiki/Jules_Michelet" },
  { id:"mill",        name:"J.S. Mill",         dates:"1806–1873",   cluster:"earlymodern",
    bio:"Utilitarian who also championed women's equality in The Subjection of Women (1869); a rare 19th-century male philosopher to take feminist arguments seriously.", wiki:"https://en.wikipedia.org/wiki/John_Stuart_Mill" },
  { id:"kierkegaard", name:"Kierkegaard",       dates:"1813–1855",   cluster:"german-idealism",
    bio:"Rejected Hegel's system in favor of the individual's leap of faith; the 'father of existentialism' whose stages of existence shaped Sartre, Camus, and Frankl.", wiki:"https://en.wikipedia.org/wiki/S%C3%B8ren_Kierkegaard" },
  { id:"marx",        name:"Marx",              dates:"1818–1883",   cluster:"german-idealism",
    bio:"Inverted Hegel's idealism into historical materialism; his analysis of capital, class, and alienation remains the most globally influential political philosophy.", wiki:"https://en.wikipedia.org/wiki/Karl_Marx" },
  { id:"engels",      name:"Friedrich Engels",  dates:"1820–1895",   cluster:"german-idealism",
    bio:"Co-author of The Communist Manifesto and intellectual partner to Marx; The Origin of the Family linked capitalism, patriarchy, and private property — directly shaping Luxemburg and Kollontai.", wiki:"https://en.wikipedia.org/wiki/Friedrich_Engels" },
  { id:"nietzsche",   name:"Nietzsche",         dates:"1844–1900",   cluster:"german-idealism",
    bio:"Declared the death of God and called for a revaluation of all values; his genealogical method became Foucault's primary tool, and his will to power haunts Deleuze.", wiki:"https://en.wikipedia.org/wiki/Friedrich_Nietzsche" },
  { id:"webb",        name:"Beatrice Webb",     dates:"1858–1943",   cluster:"earlymodern",
    bio:"Co-founder of the London School of Economics; pioneered empirical social research and Fabian socialism as a practical, evidence-based path to workers' rights.", wiki:"https://en.wikipedia.org/wiki/Beatrice_Webb" },
  { id:"luxemburg",   name:"Rosa Luxemburg",    dates:"1871–1919",   cluster:"earlymodern",
    bio:"Marxist economist and revolutionary who argued against both reformism and Leninist vanguardism; murdered in 1919 for her uncompromising socialist convictions.", wiki:"https://en.wikipedia.org/wiki/Rosa_Luxemburg" },
  { id:"kollontai",   name:"Alexandra Kollontai",dates:"1872–1952",  cluster:"earlymodern",
    bio:"Russian feminist and Bolshevik who theorized women's liberation as inseparable from socialist revolution and challenged private property in love and family life.", wiki:"https://en.wikipedia.org/wiki/Alexandra_Kollontai" },

  // ── Analytic / Linguistics ──
  { id:"peirce",      name:"C.S. Peirce",       dates:"1839–1914",   cluster:"analytic",
    bio:"Founder of pragmatism and semiotics; his theory that meaning is constituted by practical consequences influenced James, Dewey, Saussure, and 20th-century philosophy of language.", wiki:"https://en.wikipedia.org/wiki/Charles_Sanders_Peirce" },
  { id:"frege",       name:"Frege",             dates:"1848–1925",   cluster:"analytic",
    bio:"Founded modern mathematical logic and philosophy of language; his distinction between sense and reference is the bedrock from which Russell and Wittgenstein built.", wiki:"https://en.wikipedia.org/wiki/Gottlob_Frege" },
  { id:"james",       name:"William James",     dates:"1842–1910",   cluster:"analytic",
    bio:"Developed American pragmatism and radical empiricism; The Varieties of Religious Experience bridged philosophy and psychology in ways that shaped Dewey, Bergson, and Sartre.", wiki:"https://en.wikipedia.org/wiki/William_James" },
  { id:"saussure",    name:"Ferdinand de Saussure",dates:"1857–1913",cluster:"analytic",
    bio:"Founded structural linguistics by arguing that language is a system of differences; his semiotics became the foundation of structuralism and Lacan's psychoanalysis.", wiki:"https://en.wikipedia.org/wiki/Ferdinand_de_Saussure" },
  { id:"dewey",       name:"John Dewey",        dates:"1859–1952",   cluster:"analytic",
    bio:"America's foremost pragmatist; argued that philosophy must serve democracy and education — an influence on Chomsky's democratic theory and Rawls's method.", wiki:"https://en.wikipedia.org/wiki/John_Dewey" },
  { id:"russell",     name:"Bertrand Russell",  dates:"1872–1970",   cluster:"analytic",
    bio:"Co-founded analytic philosophy and symbolic logic; also a fierce public intellectual who influenced Wittgenstein, Chomsky, and a generation of political radicals.", wiki:"https://en.wikipedia.org/wiki/Bertrand_Russell" },
  { id:"wittgenstein",name:"Wittgenstein",      dates:"1889–1951",   cluster:"analytic",
    bio:"Revolutionized philosophy of language twice — with logical atomism, then by showing meaning is use in 'forms of life'; shaped Butler's speech-act theory.", wiki:"https://en.wikipedia.org/wiki/Ludwig_Wittgenstein" },
  { id:"popper",      name:"Karl Popper",       dates:"1902–1994",   cluster:"analytic",
    bio:"Proposed falsifiability as the criterion of science; The Open Society and Its Enemies is a landmark critique of Plato, Hegel, and Marx as intellectual ancestors of totalitarianism.", wiki:"https://en.wikipedia.org/wiki/Karl_Popper" },
  { id:"quine",       name:"W.V.O. Quine",      dates:"1908–2000",   cluster:"analytic",
    bio:"'Two Dogmas of Empiricism' (1951) dissolved the analytic/synthetic distinction; his naturalized epistemology argued that philosophy and science are continuous.", wiki:"https://en.wikipedia.org/wiki/Willard_Van_Orman_Quine" },
  { id:"rawls",       name:"Rawls",             dates:"1921–2002",   cluster:"analytic",
    bio:"Revived political philosophy with A Theory of Justice (1971); his veil of ignorance thought-experiment grounds liberal egalitarianism and is Sandel's primary target.", wiki:"https://en.wikipedia.org/wiki/John_Rawls" },
  { id:"chomsky",     name:"Noam Chomsky",      dates:"1928–",       cluster:"analytic",
    bio:"Revolutionized linguistics with universal grammar; his Manufacturing Consent analyses how media power shapes democratic thought.", wiki:"https://en.wikipedia.org/wiki/Noam_Chomsky" },

  // ── Psychoanalysis ──
  { id:"freud",       name:"Freud",             dates:"1856–1939",   cluster:"psychoanalysis",
    bio:"Founded psychoanalysis and mapped the unconscious; his concepts of repression and the drives permeate philosophy, literary theory, and feminism.", wiki:"https://en.wikipedia.org/wiki/Sigmund_Freud" },
  { id:"jung",        name:"Jung",              dates:"1875–1961",   cluster:"psychoanalysis",
    bio:"Broke from Freud to develop analytical psychology; his archetypes and collective unconscious influenced depth psychology, cultural theory, and Frankl's logotherapy.", wiki:"https://en.wikipedia.org/wiki/Carl_Jung" },
  { id:"lacan",       name:"Lacan",             dates:"1901–1981",   cluster:"psychoanalysis",
    bio:"Reread Freud through structural linguistics; his concepts of the mirror stage, the Other, and jouissance profoundly shaped Žižek, Butler, and French feminism.", wiki:"https://en.wikipedia.org/wiki/Jacques_Lacan" },
  { id:"frankl",      name:"Frankl",            dates:"1905–1997",   cluster:"psychoanalysis",
    bio:"Holocaust survivor who founded logotherapy around the drive for meaning; his Man's Search for Meaning is one of the most widely read books of the 20th century.", wiki:"https://en.wikipedia.org/wiki/Viktor_Frankl" },

  // ── Frankfurt School ──
  { id:"gramsci",     name:"Antonio Gramsci",   dates:"1891–1937",   cluster:"frankfurt",
    bio:"Developed 'cultural hegemony' — how ruling classes govern through consent rather than pure coercion; his Prison Notebooks, written under Mussolini, shaped postcolonial theory and critical pedagogy.", wiki:"https://en.wikipedia.org/wiki/Antonio_Gramsci" },
  { id:"benjamin",    name:"Walter Benjamin",   dates:"1892–1940",   cluster:"frankfurt",
    bio:"Blended Marxism, Jewish mysticism, and surrealism; died fleeing the Nazis, becoming a symbol of thought under erasure. His essay on art's 'aura' transformed media theory.", wiki:"https://en.wikipedia.org/wiki/Walter_Benjamin" },
  { id:"adorno",      name:"Adorno",            dates:"1903–1969",   cluster:"frankfurt",
    bio:"Diagnosed modern culture as an 'industry' manufacturing conformity; his negative dialectics refused any philosophical system that harmonizes contradiction too easily.", wiki:"https://en.wikipedia.org/wiki/Theodor_W._Adorno" },
  { id:"marcuse",     name:"Marcuse",           dates:"1898–1979",   cluster:"frankfurt",
    bio:"The '1960s guru'; argued that advanced capitalism creates one-dimensional thought, and that Eros and liberation must be recovered — hugely influential on Angela Davis and the New Left.", wiki:"https://en.wikipedia.org/wiki/Herbert_Marcuse" },
  { id:"habermas",    name:"Habermas",          dates:"1929–",       cluster:"frankfurt",
    bio:"Second-generation Frankfurt School; his theory of communicative action grounds democratic legitimacy in rational public discourse rather than power or tradition.", wiki:"https://en.wikipedia.org/wiki/J%C3%BCrgen_Habermas" },

  // ── Phenomenology / Existentialism ──
  { id:"bergson",     name:"Henri Bergson",     dates:"1859–1941",   cluster:"existential",
    bio:"Argued that lived time (durée) is irreducible to clock time; his philosophy of creative evolution and intuition profoundly influenced Deleuze, Senghor's Négritude, and Merleau-Ponty.", wiki:"https://en.wikipedia.org/wiki/Henri_Bergson" },
  { id:"husserl",     name:"Husserl",           dates:"1859–1938",   cluster:"existential",
    bio:"Founded phenomenology — the rigorous study of conscious experience 'as it appears'; the soil from which Heidegger, Sartre, and Merleau-Ponty grew.", wiki:"https://en.wikipedia.org/wiki/Edmund_Husserl" },
  { id:"heidegger",   name:"Heidegger",         dates:"1889–1976",   cluster:"existential",
    bio:"Interrogated 'the question of Being' itself; his analysis of Dasein, thrownness, and authenticity is foundational for existentialism despite his Nazi entanglement.", wiki:"https://en.wikipedia.org/wiki/Martin_Heidegger" },
  { id:"levinas",     name:"Emmanuel Levinas",  dates:"1906–1995",   cluster:"existential",
    bio:"Made ethics — responsibility to the face of the Other — foundational rather than derivative; Totality and Infinity reshaped post-Holocaust thought and influenced Derrida, Badiou, and McMullin.", wiki:"https://en.wikipedia.org/wiki/Emmanuel_L%C3%A9vinas" },
  { id:"arendt",      name:"Arendt",            dates:"1906–1975",   cluster:"existential",
    bio:"Analyzed totalitarianism, the 'banality of evil,' and public political life; her concept of natality — the power to begin anew — is a counterweight to determinism.", wiki:"https://en.wikipedia.org/wiki/Hannah_Arendt" },
  { id:"merleau",     name:"Merleau-Ponty",     dates:"1908–1961",   cluster:"existential",
    bio:"Argued that the body — not the mind — is our primary mode of being-in-the-world; his phenomenology of embodiment grounds Butler's theory of gender performance.", wiki:"https://en.wikipedia.org/wiki/Maurice_Merleau-Ponty" },
  { id:"beauvoir",    name:"de Beauvoir",       dates:"1908–1986",   cluster:"existential",
    bio:"Author of The Second Sex: 'One is not born, but rather becomes, a woman.' Transformed existentialism into feminist theory and inspired every generation of thinkers after her.", wiki:"https://en.wikipedia.org/wiki/Simone_de_Beauvoir" },
  { id:"weil",        name:"Simone Weil",       dates:"1909–1943",   cluster:"existential",
    bio:"Mystic, activist, and philosopher who worked in factories and fought in Spain; her concept of 'affliction' and the ethics of attention influenced Camus and liberation theology.", wiki:"https://en.wikipedia.org/wiki/Simone_Weil" },
  { id:"sartre",      name:"Sartre",            dates:"1905–1980",   cluster:"existential",
    bio:"Declared that existence precedes essence and that humans are 'condemned to be free'; the definitive public intellectual of 20th-century France.", wiki:"https://en.wikipedia.org/wiki/Jean-Paul_Sartre" },
  { id:"ricoeur",     name:"Paul Ricœur",       dates:"1913–2005",   cluster:"existential",
    bio:"Master hermeneuticist who argued the self is constituted through narrative; his work bridges phenomenology, analytic philosophy, and theology, influencing Habermas, Taylor, and McMullin.", wiki:"https://en.wikipedia.org/wiki/Paul_Ric%C5%93ur" },
  { id:"camus",       name:"Camus",             dates:"1913–1960",   cluster:"existential",
    bio:"Diagnosed the Absurd — the collision between our need for meaning and the world's silence — and argued for revolt rather than either despair or false hope.", wiki:"https://en.wikipedia.org/wiki/Albert_Camus" },

  // ── Postcolonial ──
  { id:"dubois",      name:"W.E.B. Du Bois",    dates:"1868–1963",   cluster:"postcolonial",
    bio:"Introduced 'double consciousness' — seeing oneself through the eyes of a racist society — as the defining structure of Black experience; essential precursor to Fanon and hooks.", wiki:"https://en.wikipedia.org/wiki/W._E._B._Du_Bois" },
  { id:"senghor",     name:"Léopold Sédar Senghor",dates:"1906–2001",cluster:"postcolonial",
    bio:"Co-founder of the Négritude movement; poet and philosopher who argued African cultural values were a positive foundation for a post-colonial identity.", wiki:"https://en.wikipedia.org/wiki/L%C3%A9opold_S%C3%A9dar_Senghor" },
  { id:"cesaire",     name:"Aimé Césaire",      dates:"1913–2008",   cluster:"postcolonial",
    bio:"Co-founder of Négritude; his Discourse on Colonialism (1950) argued that Nazism was colonialism turned back on Europe — a radical reframe of modern history.", wiki:"https://en.wikipedia.org/wiki/Aim%C3%A9_C%C3%A9saire" },
  { id:"fanon",       name:"Fanon",             dates:"1925–1961",   cluster:"postcolonial",
    bio:"Psychiatrist and revolutionary whose The Wretched of the Earth analyzed how colonialism destroys the colonized psyche; indispensable for hooks, Butler, and postcolonial studies.", wiki:"https://en.wikipedia.org/wiki/Frantz_Fanon" },
  { id:"said",        name:"Edward Said",       dates:"1935–2003",   cluster:"postcolonial",
    bio:"Orientalism (1978) demonstrated how Western scholarship constructed the 'Orient' as exotic and inferior — founding the academic field of postcolonial studies.", wiki:"https://en.wikipedia.org/wiki/Edward_Said" },
  { id:"spivak",      name:"Gayatri Spivak",    dates:"1942–",       cluster:"postcolonial",
    bio:"Translated Derrida and wrote 'Can the Subaltern Speak?' — asking whether colonial subjects can represent themselves within Western academic discourse.", wiki:"https://en.wikipedia.org/wiki/Gayatri_Chakravorty_Spivak" },
  { id:"anzaldua",    name:"Gloria Anzaldúa",   dates:"1942–2004",   cluster:"postcolonial",
    bio:"Chicana feminist whose Borderlands/La Frontera coined 'mestiza consciousness' — a theory of identity forged in and through cultural, racial, and sexual borders.", wiki:"https://en.wikipedia.org/wiki/Gloria_Anzald%C3%BAa" },
  { id:"bhabha",      name:"Homi Bhabha",       dates:"1949–",       cluster:"postcolonial",
    bio:"Theorized colonial mimicry and 'hybridity' — the third space where colonial subjects produce something unsettling to both colonizer and colonized.", wiki:"https://en.wikipedia.org/wiki/Homi_K._Bhabha" },
  { id:"mbembe",      name:"Achille Mbembe",    dates:"1957–",       cluster:"postcolonial",
    bio:"Developed 'necropolitics' — the sovereign power to decide who must die — extending Foucault's biopolitics into the African colonial and postcolonial context.", wiki:"https://en.wikipedia.org/wiki/Achille_Mbembe" },

  // ── Poststructuralism ──
  { id:"borges",      name:"Jorge Luis Borges", dates:"1899–1986",   cluster:"poststructural",
    bio:"Argentine writer-philosopher whose labyrinths, infinite libraries, and forking paths made fiction a vehicle for metaphysics; Foucault's The Order of Things opens with a Borges passage, and his influence on Derrida and postmodern thought is immeasurable.", wiki:"https://en.wikipedia.org/wiki/Jorge_Luis_Borges" },
  { id:"deleuze",     name:"Deleuze",           dates:"1925–1995",   cluster:"poststructural",
    bio:"Created a philosophy of difference, becoming, and immanence; his collaborations with Guattari (Anti-Oedipus, A Thousand Plateaus) are foundational for radical theory.", wiki:"https://en.wikipedia.org/wiki/Gilles_Deleuze" },
  { id:"foucault",    name:"Foucault",          dates:"1926–1984",   cluster:"poststructural",
    bio:"Mapped how power produces knowledge, bodies, and subjects; his genealogies of madness, the clinic, the prison, and sexuality transformed the humanities.", wiki:"https://en.wikipedia.org/wiki/Michel_Foucault" },
  { id:"baudrillard", name:"Baudrillard",       dates:"1929–2007",   cluster:"poststructural",
    bio:"Argued that in postmodern consumer society signs and simulations replace reality; the simulacrum precedes the real — a diagnosis of media culture that influenced cultural studies globally.", wiki:"https://en.wikipedia.org/wiki/Jean_Baudrillard" },
  { id:"derrida",     name:"Derrida",           dates:"1930–2004",   cluster:"poststructural",
    bio:"Founded deconstruction — exposing hidden contradictions in texts; his analyses of presence, différance, and the supplement shape Butler and Spivak.", wiki:"https://en.wikipedia.org/wiki/Jacques_Derrida" },
  { id:"badiou",      name:"Alain Badiou",      dates:"1937–",       cluster:"poststructural",
    bio:"Revived the concept of the Event — a rupture opening genuinely new truth-procedures in love, art, science, and politics; a rare contemporary defender of both Plato and communist universalism.", wiki:"https://en.wikipedia.org/wiki/Alain_Badiou" },
  { id:"zizek",       name:"Žižek",             dates:"1949–",       cluster:"poststructural",
    bio:"Combines Lacan, Hegel, and Marx through readings of popular culture; argues ideology operates most powerfully when we think we've already seen through it.", wiki:"https://en.wikipedia.org/wiki/%C5%BDi%C5%BEek" },

  // ── Critical / Feminist Theory ──
  { id:"irigaray",    name:"Luce Irigaray",     dates:"1930–",       cluster:"critical",
    bio:"Argued Western thought is structured by a masculine imaginary that erases sexual difference; a major voice in écriture féminine and the philosophy of sexual difference.", wiki:"https://en.wikipedia.org/wiki/Luce_Irigaray" },
  { id:"sontag",      name:"Sontag",            dates:"1933–2004",   cluster:"cultural",
    bio:"Her essays on photography, illness, and war reshaped how we think about images and suffering; Notes on Camp (1964) made queer aesthetics a philosophical subject.", wiki:"https://en.wikipedia.org/wiki/Susan_Sontag" },
  { id:"cixous",      name:"Hélène Cixous",     dates:"1937–",       cluster:"critical",
    bio:"Theorist of 'writing the body'; her 1975 essay 'The Laugh of the Medusa' called for a feminine writing practice that disrupts and exceeds patriarchal language.", wiki:"https://en.wikipedia.org/wiki/H%C3%A9l%C3%A8ne_Cixous" },
  { id:"lorde",       name:"Audre Lorde",       dates:"1934–1992",   cluster:"critical",
    bio:"Poet and activist whose Sister Outsider articulated an intersectional feminism rooted in Black lesbian experience; 'the master's tools will never dismantle the master's house' is one of the most cited lines in critical theory.", wiki:"https://en.wikipedia.org/wiki/Audre_Lorde" },
  { id:"angela",      name:"Angela Davis",      dates:"1944–",       cluster:"critical",
    bio:"Philosopher and prison abolitionist whose Are Prisons Obsolete? and Women, Race & Class link racial capitalism, patriarchy, and carceral power — one of the most influential thinkers in contemporary critical theory.", wiki:"https://en.wikipedia.org/wiki/Angela_Davis" },
  { id:"hooks",       name:"bell hooks",        dates:"1952–2021",   cluster:"critical",
    bio:"Wove together feminism, race, and class to argue that love and community are revolutionary acts; she wrote for everyone, not just the academy.", wiki:"https://en.wikipedia.org/wiki/Bell_hooks" },
  { id:"haraway",     name:"Donna Haraway",     dates:"1944–",       cluster:"critical",
    bio:"A Cyborg Manifesto (1985) proposed the cyborg as a feminist figure for transcending nature/culture dualisms; her 'situated knowledge' argument reshaped feminist epistemology and science studies.", wiki:"https://en.wikipedia.org/wiki/Donna_Haraway" },
  { id:"butler",      name:"Judith Butler",     dates:"1956–",       cluster:"critical",
    bio:"Argued in Gender Trouble (1990) that gender is performative, not essential; transformed feminist and queer theory by showing identity is produced through repeated acts.", wiki:"https://en.wikipedia.org/wiki/Judith_Butler" },
  { id:"collins",     name:"Patricia Hill Collins",dates:"1948–",    cluster:"critical",
    bio:"Developed the matrix of domination and popularized intersectionality as a sociological and philosophical framework in Black Feminist Thought (1990).", wiki:"https://en.wikipedia.org/wiki/Patricia_Hill_Collins" },
  { id:"crenshaw",    name:"Kimberlé Crenshaw", dates:"1959–",       cluster:"critical",
    bio:"Legal scholar who coined 'intersectionality' to describe how race and gender overlap in producing specific forms of discrimination invisible to single-axis analysis.", wiki:"https://en.wikipedia.org/wiki/Kimberl%C3%A9_Crenshaw" },
  { id:"young",       name:"Iris Marion Young", dates:"1949–2006",   cluster:"critical",
    bio:"Justice and the Politics of Difference (1990) challenged the ideal of impartiality in liberal theory and developed a structural account of oppression essential in feminist political philosophy.", wiki:"https://en.wikipedia.org/wiki/Iris_Marion_Young" },
  { id:"west",        name:"Cornel West",       dates:"1953–",       cluster:"critical",
    bio:"Blends American pragmatism, prophetic Christianity, and socialist politics; Race Matters argues that the blues tradition and Black experience are essential resources for democratic renewal.", wiki:"https://en.wikipedia.org/wiki/Cornel_West" },

  // ── Contemporary ──
  { id:"macintyre",   name:"MacIntyre",         dates:"1929–",       cluster:"contemporary",
    bio:"Revived Aristotelian virtue ethics in After Virtue (1981), arguing that modern moral philosophy is in ruins because it lost its teleological framework; key influence on Sandel and McMullin.", wiki:"https://en.wikipedia.org/wiki/Alasdair_MacIntyre" },
  { id:"taylor",      name:"Charles Taylor",    dates:"1931–",       cluster:"contemporary",
    bio:"Philosopher of recognition and authenticity; Sources of the Self traces modern identity's moral roots and The Ethics of Authenticity critiques the hollow individualism that authentic selfhood can produce.", wiki:"https://en.wikipedia.org/wiki/Charles_Taylor_(philosopher)" },
  { id:"nagel",       name:"Thomas Nagel",      dates:"1937–",       cluster:"contemporary",
    bio:"'What Is It Like to Be a Bat?' (1974) gave the hard problem of consciousness its most famous formulation; The View from Nowhere defends irreducible subjectivity against scientific reductionism.", wiki:"https://en.wikipedia.org/wiki/Thomas_Nagel" },
  { id:"singer",      name:"Peter Singer",      dates:"1946–",       cluster:"contemporary",
    bio:"The most globally influential living ethicist; Animal Liberation (1975) launched the animal rights movement and Practical Ethics applies utilitarian reasoning to poverty, bioethics, and the environment.", wiki:"https://en.wikipedia.org/wiki/Peter_Singer" },
  { id:"nussbaum",    name:"Nussbaum",          dates:"1947–",       cluster:"contemporary",
    bio:"Developed the capabilities approach — measuring justice across ten core human dimensions — drawing on Aristotle and applied to gender, disability, and global justice.", wiki:"https://en.wikipedia.org/wiki/Martha_Nussbaum" },
  { id:"sandel",      name:"Sandel",            dates:"1953–",       cluster:"contemporary",
    bio:"Communitarian critic of Rawlsian liberalism; argues in Justice and The Tyranny of Merit that markets and meritocracy erode the shared civic life that makes freedom possible.", wiki:"https://en.wikipedia.org/wiki/Michael_Sandel" },
  { id:"mcmullin",    name:"Irene McMullin",    dates:"1975–",       cluster:"contemporary",
    bio:"Professor at the University of Essex whose Existential Flourishing (2019) weaves virtue ethics with existential phenomenology — Heidegger and Levinas especially — arguing that flourishing means successfully balancing self-fulfilment, moral responsibility, and intersubjective answerability.", wiki:"https://en.wikipedia.org/wiki/Irene_McMullin" },
  { id:"dupuy",       name:"Jean-Pierre Dupuy", dates:"1941–",       cluster:"contemporary",
    bio:"French philosopher-engineer who developed 'enlightened catastrophism' — we must act as if catastrophe is certain even though we hope it is not; draws on Girard, Illich, and complex systems theory to rethink technology and the sacred.", wiki:"https://en.wikipedia.org/wiki/Jean-Pierre_Dupuy" },
  { id:"varoufakis",  name:"Yanis Varoufakis",  dates:"1961–",       cluster:"contemporary",
    bio:"Greek economist-philosopher whose Technofeudalism argues that cloud capital has superseded market capitalism; brings Marxist political economy, game theory, and radical democracy into urgent conversation with the present.", wiki:"https://en.wikipedia.org/wiki/Yanis_Varoufakis" },
  { id:"harari",      name:"Yuval Noah Harari", dates:"1976–",       cluster:"history",
    bio:"Israeli historian-philosopher whose Sapiens and Homo Deus offer sweeping grand narratives of human history, consciousness, and technology — bringing philosophical questions about meaning, free will, and the future to a global mass audience.", wiki:"https://en.wikipedia.org/wiki/Yuval_Noah_Harari" },
  { id:"klein",       name:"Naomi Klein",       dates:"1970–",       cluster:"contemporary",
    bio:"No Logo and The Shock Doctrine theorized how corporate branding and disaster capitalism reshape political subjectivity and democratic institutions; one of the most widely read political thinkers of her generation.", wiki:"https://en.wikipedia.org/wiki/Naomi_Klein" },
];

const influences = [
  // Eastern foundations
  { from:"laozi",       to:"zhuangzi",     strength:3 },
  { from:"laozi",       to:"nishida",      strength:2 },
  { from:"laozi",       to:"heidegger",    strength:1 },
  { from:"laozi",       to:"deleuze",      strength:1 },
  { from:"confucius",   to:"zhuangzi",     strength:1 },
  { from:"confucius",   to:"nishida",      strength:2 },
  { from:"zhuangzi",    to:"nishida",      strength:2 },
  { from:"zhuangzi",    to:"deleuze",      strength:1 },
  { from:"nagarjuna",   to:"nishida",      strength:3 },
  { from:"nagarjuna",   to:"derrida",      strength:1 },

  // Pre-Socratic → Ancient
  { from:"heraclitus",  to:"plato",        strength:2 },
  { from:"heraclitus",  to:"hegel",        strength:2 },
  { from:"heraclitus",  to:"nietzsche",    strength:2 },
  { from:"heraclitus",  to:"thucydides",   strength:2 },
  { from:"parmenides",  to:"plato",        strength:3 },
  { from:"parmenides",  to:"hegel",        strength:2 },
  { from:"thucydides",  to:"machiavelli",  strength:3 },
  { from:"thucydides",  to:"hobbes",       strength:2 },
  { from:"socrates",    to:"plato",        strength:3 },
  { from:"socrates",    to:"aristotle",    strength:2 },
  { from:"socrates",    to:"zeno",         strength:2 },
  { from:"socrates",    to:"kierkegaard",  strength:2 },
  { from:"socrates",    to:"thucydides",   strength:1 },
  { from:"plato",       to:"aristotle",    strength:3 },
  { from:"plato",       to:"plotinus",     strength:3 },
  { from:"plato",       to:"hypatia",      strength:2 },
  { from:"plato",       to:"zeno",         strength:2 },
  { from:"plato",       to:"augustine",    strength:2 },
  { from:"plato",       to:"kant",         strength:2 },
  { from:"plato",       to:"hegel",        strength:3 },
  { from:"plato",       to:"schopenhauer", strength:2 },
  { from:"plato",       to:"weil",         strength:2 },
  { from:"plato",       to:"nussbaum",     strength:3 },
  { from:"plato",       to:"sandel",       strength:2 },
  { from:"plato",       to:"badiou",       strength:2 },
  { from:"plato",       to:"montaigne",    strength:2 },
  { from:"plato",       to:"alfarabi",     strength:2 },
  { from:"aristotle",   to:"avicenna",     strength:3 },
  { from:"aristotle",   to:"averroes",     strength:3 },
  { from:"aristotle",   to:"aquinas",      strength:3 },
  { from:"aristotle",   to:"alfarabi",     strength:3 },
  { from:"aristotle",   to:"machiavelli",  strength:2 },
  { from:"aristotle",   to:"hobbes",       strength:2 },
  { from:"aristotle",   to:"kant",         strength:2 },
  { from:"aristotle",   to:"hegel",        strength:2 },
  { from:"aristotle",   to:"marx",         strength:2 },
  { from:"aristotle",   to:"arendt",       strength:2 },
  { from:"aristotle",   to:"nussbaum",     strength:3 },
  { from:"aristotle",   to:"sandel",       strength:3 },
  { from:"aristotle",   to:"macintyre",    strength:3 },
  { from:"aristotle",   to:"bacon",        strength:2 },
  { from:"aristotle",   to:"plotinus",     strength:2 },
  { from:"aristotle",   to:"augustine",    strength:2 },
  { from:"aristotle",   to:"saussure",     strength:1 },
  { from:"aristotle",   to:"chrysippus",   strength:1 },
  { from:"aristotle",   to:"pizan",        strength:1 },
  { from:"aristotle",   to:"ibn_khaldun",  strength:2 },
  { from:"aristotle",   to:"spinoza",      strength:1 },
  { from:"aristotle",   to:"mcmullin",     strength:2 },

  // Stoic chain
  { from:"zeno",        to:"chrysippus",   strength:3 },
  { from:"zeno",        to:"epictetus",    strength:2 },
  { from:"zeno",        to:"marcus",       strength:2 },
  { from:"zeno",        to:"seneca",       strength:3 },
  { from:"chrysippus",  to:"epictetus",    strength:3 },
  { from:"chrysippus",  to:"marcus",       strength:2 },
  { from:"seneca",      to:"montaigne",    strength:3 },
  { from:"seneca",      to:"descartes",    strength:1 },
  { from:"epictetus",   to:"marcus",       strength:3 },
  { from:"epictetus",   to:"frankl",       strength:2 },
  { from:"marcus",      to:"weil",         strength:2 },
  { from:"marcus",      to:"montaigne",    strength:2 },

  // Neoplatonic / Medieval
  { from:"plotinus",    to:"augustine",    strength:3 },
  { from:"plotinus",    to:"hypatia",      strength:3 },
  { from:"plotinus",    to:"hildegard",    strength:2 },
  { from:"augustine",   to:"descartes",    strength:2 },
  { from:"augustine",   to:"hildegard",    strength:2 },
  { from:"augustine",   to:"aquinas",      strength:2 },
  { from:"augustine",   to:"erasmus",      strength:2 },
  { from:"augustine",   to:"pizan",        strength:2 },
  { from:"alfarabi",    to:"avicenna",     strength:3 },
  { from:"alfarabi",    to:"averroes",     strength:2 },
  { from:"avicenna",    to:"averroes",     strength:2 },
  { from:"avicenna",    to:"aquinas",      strength:2 },
  { from:"averroes",    to:"aquinas",      strength:3 },
  { from:"averroes",    to:"ibn_khaldun",  strength:2 },
  { from:"aquinas",     to:"kant",         strength:2 },
  { from:"aquinas",     to:"sandel",       strength:2 },
  { from:"aquinas",     to:"nussbaum",     strength:1 },
  { from:"aquinas",     to:"macintyre",    strength:2 },
  { from:"aquinas",     to:"erasmus",      strength:1 },
  { from:"ibn_khaldun", to:"marx",         strength:2 },
  { from:"ibn_khaldun", to:"gramsci",      strength:1 },
  { from:"ibn_khaldun", to:"michelet",     strength:1 },
  { from:"pizan",       to:"wollstonecraft",strength:2 },
  { from:"pizan",       to:"beauvoir",     strength:1 },

  // Early Modern
  { from:"erasmus",     to:"montaigne",    strength:3 },
  { from:"erasmus",     to:"bacon",        strength:2 },
  { from:"bacon",       to:"locke",        strength:3 },
  { from:"bacon",       to:"hobbes",       strength:2 },
  { from:"bacon",       to:"hume",         strength:2 },
  { from:"bacon",       to:"russell",      strength:1 },
  { from:"montaigne",   to:"descartes",    strength:2 },
  { from:"montaigne",   to:"rousseau",     strength:2 },
  { from:"montaigne",   to:"pascal",       strength:2 },
  { from:"montaigne",   to:"hegel",        strength:1 },
  { from:"hobbes",      to:"locke",        strength:3 },
  { from:"hobbes",      to:"rousseau",     strength:2 },
  { from:"hobbes",      to:"kant",         strength:1 },
  { from:"descartes",   to:"spinoza",      strength:3 },
  { from:"descartes",   to:"leibniz",      strength:3 },
  { from:"descartes",   to:"kant",         strength:2 },
  { from:"descartes",   to:"husserl",      strength:2 },
  { from:"descartes",   to:"locke",        strength:2 },
  { from:"descartes",   to:"pascal",       strength:2 },
  { from:"descartes",   to:"hume",         strength:2 },
  { from:"pascal",      to:"kierkegaard",  strength:2 },
  { from:"pascal",      to:"weil",         strength:2 },
  { from:"spinoza",     to:"leibniz",      strength:2 },
  { from:"spinoza",     to:"hegel",        strength:3 },
  { from:"spinoza",     to:"deleuze",      strength:3 },
  { from:"spinoza",     to:"michelet",     strength:2 },
  { from:"spinoza",     to:"marx",         strength:2 },
  { from:"locke",       to:"rousseau",     strength:2 },
  { from:"locke",       to:"kant",         strength:2 },
  { from:"locke",       to:"rawls",        strength:2 },
  { from:"locke",       to:"wollstonecraft",strength:2 },
  { from:"locke",       to:"mill",         strength:2 },
  { from:"locke",       to:"voltaire",     strength:2 },
  { from:"locke",       to:"bentham",      strength:1 },
  { from:"locke",       to:"adamsmith",    strength:2 },
  { from:"leibniz",     to:"kant",         strength:2 },
  { from:"leibniz",     to:"voltaire",     strength:2 },
  { from:"leibniz",     to:"frege",        strength:2 },
  { from:"leibniz",     to:"russell",      strength:1 },
  { from:"voltaire",    to:"rousseau",     strength:2 },
  { from:"voltaire",    to:"mill",         strength:1 },
  { from:"voltaire",    to:"kant",         strength:1 },
  { from:"hume",        to:"kant",         strength:3 },
  { from:"hume",        to:"mill",         strength:2 },
  { from:"hume",        to:"rawls",        strength:1 },
  { from:"hume",        to:"bentham",      strength:2 },
  { from:"hume",        to:"adamsmith",    strength:3 },
  { from:"hume",        to:"james",        strength:1 },
  { from:"hume",        to:"popper",       strength:1 },
  { from:"rousseau",    to:"kant",         strength:3 },
  { from:"rousseau",    to:"hegel",        strength:2 },
  { from:"rousseau",    to:"wollstonecraft",strength:2 },
  { from:"rousseau",    to:"marx",         strength:1 },
  { from:"rousseau",    to:"shelley",      strength:2 },
  { from:"adamsmith",   to:"marx",         strength:3 },
  { from:"adamsmith",   to:"mill",         strength:2 },
  { from:"adamsmith",   to:"bentham",      strength:1 },
  { from:"bentham",     to:"mill",         strength:3 },
  { from:"bentham",     to:"foucault",     strength:2 },
  { from:"bentham",     to:"singer",       strength:3 },
  { from:"bentham",     to:"nussbaum",     strength:1 },
  { from:"wollstonecraft",to:"mill",       strength:2 },
  { from:"wollstonecraft",to:"beauvoir",   strength:2 },
  { from:"wollstonecraft",to:"hooks",      strength:1 },
  { from:"wollstonecraft",to:"shelley",    strength:3 },

  // Kant onward
  { from:"kant",        to:"hegel",        strength:3 },
  { from:"kant",        to:"schopenhauer", strength:3 },
  { from:"kant",        to:"marx",         strength:2 },
  { from:"kant",        to:"nietzsche",    strength:2 },
  { from:"kant",        to:"rawls",        strength:3 },
  { from:"kant",        to:"arendt",       strength:2 },
  { from:"kant",        to:"adorno",       strength:2 },
  { from:"kant",        to:"sandel",       strength:2 },
  { from:"kant",        to:"husserl",      strength:2 },
  { from:"kant",        to:"dewey",        strength:1 },
  { from:"kant",        to:"frege",        strength:2 },
  { from:"kant",        to:"peirce",       strength:2 },
  { from:"kant",        to:"bergson",      strength:1 },
  { from:"kant",        to:"saussure",     strength:1 },
  { from:"kant",        to:"popper",       strength:1 },

  // German Idealism
  { from:"hegel",       to:"marx",         strength:3 },
  { from:"hegel",       to:"kierkegaard",  strength:3 },
  { from:"hegel",       to:"michelet",     strength:2 },
  { from:"hegel",       to:"nietzsche",    strength:2 },
  { from:"hegel",       to:"sartre",       strength:2 },
  { from:"hegel",       to:"beauvoir",     strength:2 },
  { from:"hegel",       to:"foucault",     strength:2 },
  { from:"hegel",       to:"deleuze",      strength:2 },
  { from:"hegel",       to:"zizek",        strength:3 },
  { from:"hegel",       to:"adorno",       strength:3 },
  { from:"hegel",       to:"arendt",       strength:2 },
  { from:"hegel",       to:"habermas",     strength:2 },
  { from:"hegel",       to:"dewey",        strength:2 },
  { from:"hegel",       to:"luxemburg",    strength:1 },
  { from:"hegel",       to:"dubois",       strength:2 },
  { from:"hegel",       to:"gramsci",      strength:2 },
  { from:"hegel",       to:"engels",       strength:3 },
  { from:"hegel",       to:"peirce",       strength:1 },
  { from:"hegel",       to:"senghor",      strength:1 },
  { from:"hegel",       to:"badiou",       strength:2 },
  { from:"hegel",       to:"taylor",       strength:2 },
  { from:"hegel",       to:"varoufakis",   strength:2 },
  { from:"schopenhauer",to:"nietzsche",    strength:3 },
  { from:"schopenhauer",to:"freud",        strength:2 },
  { from:"schopenhauer",to:"wittgenstein", strength:2 },
  { from:"schopenhauer",to:"borges",       strength:3 },
  { from:"kierkegaard", to:"sartre",       strength:3 },
  { from:"kierkegaard", to:"camus",        strength:2 },
  { from:"kierkegaard", to:"frankl",       strength:2 },
  { from:"kierkegaard", to:"heidegger",    strength:2 },
  { from:"marx",        to:"adorno",       strength:3 },
  { from:"marx",        to:"marcuse",      strength:3 },
  { from:"marx",        to:"benjamin",     strength:3 },
  { from:"marx",        to:"sartre",       strength:2 },
  { from:"marx",        to:"foucault",     strength:2 },
  { from:"marx",        to:"fanon",        strength:2 },
  { from:"marx",        to:"hooks",        strength:2 },
  { from:"marx",        to:"zizek",        strength:2 },
  { from:"marx",        to:"cesaire",      strength:2 },
  { from:"marx",        to:"habermas",     strength:2 },
  { from:"marx",        to:"gramsci",      strength:3 },
  { from:"marx",        to:"luxemburg",    strength:2 },
  { from:"marx",        to:"kollontai",    strength:2 },
  { from:"marx",        to:"webb",         strength:2 },
  { from:"marx",        to:"dubois",       strength:2 },
  { from:"marx",        to:"angela",       strength:2 },
  { from:"marx",        to:"badiou",       strength:2 },
  { from:"marx",        to:"senghor",      strength:2 },
  { from:"marx",        to:"baudrillard",  strength:2 },
  { from:"marx",        to:"klein",        strength:1 },
  { from:"marx",        to:"varoufakis",   strength:3 },
  { from:"nietzsche",   to:"freud",        strength:2 },
  { from:"nietzsche",   to:"jung",         strength:2 },
  { from:"nietzsche",   to:"sartre",       strength:2 },
  { from:"nietzsche",   to:"camus",        strength:2 },
  { from:"nietzsche",   to:"foucault",     strength:3 },
  { from:"nietzsche",   to:"deleuze",      strength:3 },
  { from:"nietzsche",   to:"heidegger",    strength:3 },
  { from:"nietzsche",   to:"borges",       strength:2 },
  { from:"nietzsche",   to:"harari",       strength:2 },
  { from:"engels",      to:"luxemburg",    strength:3 },
  { from:"engels",      to:"kollontai",    strength:2 },
  { from:"mill",        to:"rawls",        strength:2 },
  { from:"mill",        to:"nussbaum",     strength:2 },
  { from:"mill",        to:"beauvoir",     strength:1 },
  { from:"mill",        to:"webb",         strength:2 },
  { from:"mill",        to:"singer",       strength:2 },
  { from:"luxemburg",   to:"kollontai",    strength:2 },
  { from:"luxemburg",   to:"adorno",       strength:1 },
  { from:"kollontai",   to:"beauvoir",     strength:1 },

  // Analytic
  { from:"peirce",      to:"james",        strength:3 },
  { from:"peirce",      to:"dewey",        strength:3 },
  { from:"peirce",      to:"saussure",     strength:2 },
  { from:"frege",       to:"russell",      strength:3 },
  { from:"frege",       to:"wittgenstein", strength:3 },
  { from:"frege",       to:"quine",        strength:2 },
  { from:"james",       to:"dewey",        strength:3 },
  { from:"james",       to:"bergson",      strength:2 },
  { from:"james",       to:"sartre",       strength:1 },
  { from:"saussure",    to:"lacan",        strength:3 },
  { from:"saussure",    to:"derrida",      strength:3 },
  { from:"saussure",    to:"foucault",     strength:2 },
  { from:"saussure",    to:"baudrillard",  strength:2 },
  { from:"dewey",       to:"rawls",        strength:2 },
  { from:"dewey",       to:"chomsky",      strength:2 },
  { from:"dewey",       to:"west",         strength:2 },
  { from:"russell",     to:"wittgenstein", strength:3 },
  { from:"russell",     to:"chomsky",      strength:2 },
  { from:"russell",     to:"quine",        strength:3 },
  { from:"russell",     to:"popper",       strength:2 },
  { from:"russell",     to:"nagel",        strength:1 },
  { from:"wittgenstein",to:"butler",       strength:2 },
  { from:"wittgenstein",to:"nagel",        strength:1 },
  { from:"popper",      to:"habermas",     strength:1 },
  { from:"quine",       to:"nagel",        strength:1 },
  { from:"quine",       to:"singer",       strength:1 },
  { from:"rawls",       to:"sandel",       strength:3 },
  { from:"rawls",       to:"nussbaum",     strength:2 },
  { from:"rawls",       to:"habermas",     strength:1 },
  { from:"rawls",       to:"young",        strength:2 },
  { from:"rawls",       to:"nagel",        strength:1 },
  { from:"chomsky",     to:"habermas",     strength:2 },
  { from:"chomsky",     to:"zizek",        strength:1 },
  { from:"chomsky",     to:"hooks",        strength:1 },

  // Psychoanalysis
  { from:"freud",       to:"jung",         strength:3 },
  { from:"freud",       to:"frankl",       strength:2 },
  { from:"freud",       to:"lacan",        strength:3 },
  { from:"freud",       to:"sartre",       strength:2 },
  { from:"freud",       to:"beauvoir",     strength:2 },
  { from:"freud",       to:"foucault",     strength:2 },
  { from:"freud",       to:"deleuze",      strength:2 },
  { from:"freud",       to:"zizek",        strength:3 },
  { from:"freud",       to:"butler",       strength:2 },
  { from:"freud",       to:"adorno",       strength:2 },
  { from:"freud",       to:"marcuse",      strength:2 },
  { from:"freud",       to:"benjamin",     strength:1 },
  { from:"freud",       to:"irigaray",     strength:2 },
  { from:"freud",       to:"cixous",       strength:2 },
  { from:"jung",        to:"frankl",       strength:2 },
  { from:"lacan",       to:"zizek",        strength:3 },
  { from:"lacan",       to:"butler",       strength:3 },
  { from:"lacan",       to:"derrida",      strength:2 },
  { from:"lacan",       to:"foucault",     strength:2 },
  { from:"lacan",       to:"irigaray",     strength:3 },
  { from:"lacan",       to:"cixous",       strength:2 },
  { from:"lacan",       to:"badiou",       strength:2 },
  { from:"lacan",       to:"bhabha",       strength:2 },

  // Frankfurt School
  { from:"gramsci",     to:"adorno",       strength:1 },
  { from:"gramsci",     to:"marcuse",      strength:1 },
  { from:"gramsci",     to:"foucault",     strength:2 },
  { from:"gramsci",     to:"hooks",        strength:2 },
  { from:"gramsci",     to:"said",         strength:2 },
  { from:"gramsci",     to:"spivak",       strength:2 },
  { from:"gramsci",     to:"klein",        strength:2 },
  { from:"adorno",      to:"marcuse",      strength:2 },
  { from:"adorno",      to:"benjamin",     strength:2 },
  { from:"adorno",      to:"habermas",     strength:3 },
  { from:"adorno",      to:"hooks",        strength:1 },
  { from:"marcuse",     to:"hooks",        strength:2 },
  { from:"marcuse",     to:"foucault",     strength:1 },
  { from:"marcuse",     to:"habermas",     strength:2 },
  { from:"marcuse",     to:"angela",       strength:3 },
  { from:"benjamin",    to:"adorno",       strength:2 },
  { from:"benjamin",    to:"derrida",      strength:1 },
  { from:"benjamin",    to:"hooks",        strength:1 },

  // Phenomenology / Existentialism
  { from:"bergson",     to:"deleuze",      strength:3 },
  { from:"bergson",     to:"merleau",      strength:2 },
  { from:"bergson",     to:"senghor",      strength:2 },
  { from:"bergson",     to:"husserl",      strength:1 },
  { from:"husserl",     to:"heidegger",    strength:3 },
  { from:"husserl",     to:"sartre",       strength:3 },
  { from:"husserl",     to:"merleau",      strength:3 },
  { from:"husserl",     to:"beauvoir",     strength:2 },
  { from:"husserl",     to:"levinas",      strength:3 },
  { from:"husserl",     to:"ricoeur",      strength:2 },
  { from:"heidegger",   to:"sartre",       strength:3 },
  { from:"heidegger",   to:"foucault",     strength:2 },
  { from:"heidegger",   to:"derrida",      strength:3 },
  { from:"heidegger",   to:"arendt",       strength:3 },
  { from:"heidegger",   to:"merleau",      strength:2 },
  { from:"heidegger",   to:"levinas",      strength:2 },
  { from:"heidegger",   to:"nishida",      strength:2 },
  { from:"heidegger",   to:"ricoeur",      strength:2 },
  { from:"heidegger",   to:"taylor",       strength:2 },
  { from:"heidegger",   to:"mcmullin",     strength:3 },
  { from:"levinas",     to:"derrida",      strength:3 },
  { from:"levinas",     to:"badiou",       strength:2 },
  { from:"levinas",     to:"ricoeur",      strength:2 },
  { from:"levinas",     to:"butler",       strength:1 },
  { from:"levinas",     to:"mcmullin",     strength:3 },
  { from:"levinas",     to:"dupuy",        strength:2 },
  { from:"merleau",     to:"beauvoir",     strength:3 },
  { from:"merleau",     to:"butler",       strength:3 },
  { from:"merleau",     to:"foucault",     strength:2 },
  { from:"sartre",      to:"beauvoir",     strength:3 },
  { from:"sartre",      to:"camus",        strength:2 },
  { from:"sartre",      to:"foucault",     strength:2 },
  { from:"sartre",      to:"fanon",        strength:3 },
  { from:"sartre",      to:"butler",       strength:2 },
  { from:"beauvoir",    to:"butler",       strength:3 },
  { from:"beauvoir",    to:"hooks",        strength:2 },
  { from:"beauvoir",    to:"nussbaum",     strength:1 },
  { from:"beauvoir",    to:"irigaray",     strength:2 },
  { from:"beauvoir",    to:"cixous",       strength:2 },
  { from:"beauvoir",    to:"anzaldua",     strength:2 },
  { from:"beauvoir",    to:"young",        strength:2 },
  { from:"beauvoir",    to:"lorde",        strength:1 },
  { from:"weil",        to:"camus",        strength:1 },
  { from:"arendt",      to:"hooks",        strength:1 },
  { from:"arendt",      to:"nussbaum",     strength:1 },
  { from:"arendt",      to:"habermas",     strength:2 },
  { from:"ricoeur",     to:"habermas",     strength:1 },
  { from:"ricoeur",     to:"taylor",       strength:2 },
  { from:"ricoeur",     to:"mcmullin",     strength:2 },

  // Postcolonial
  { from:"dubois",      to:"fanon",        strength:3 },
  { from:"dubois",      to:"hooks",        strength:2 },
  { from:"dubois",      to:"cesaire",      strength:2 },
  { from:"dubois",      to:"collins",      strength:2 },
  { from:"dubois",      to:"west",         strength:3 },
  { from:"dubois",      to:"lorde",        strength:2 },
  { from:"senghor",     to:"cesaire",      strength:2 },
  { from:"senghor",     to:"fanon",        strength:2 },
  { from:"cesaire",     to:"fanon",        strength:3 },
  { from:"cesaire",     to:"hooks",        strength:2 },
  { from:"fanon",       to:"hooks",        strength:3 },
  { from:"fanon",       to:"butler",       strength:1 },
  { from:"fanon",       to:"spivak",       strength:2 },
  { from:"fanon",       to:"anzaldua",     strength:2 },
  { from:"fanon",       to:"collins",      strength:2 },
  { from:"fanon",       to:"bhabha",       strength:2 },
  { from:"fanon",       to:"mbembe",       strength:3 },
  { from:"said",        to:"bhabha",       strength:3 },
  { from:"said",        to:"spivak",       strength:2 },
  { from:"said",        to:"mbembe",       strength:2 },
  { from:"bhabha",      to:"spivak",       strength:1 },
  { from:"bhabha",      to:"mbembe",       strength:2 },

  // Poststructuralism
  { from:"borges",      to:"foucault",     strength:3 },
  { from:"borges",      to:"derrida",      strength:2 },
  { from:"borges",      to:"deleuze",      strength:2 },
  { from:"borges",      to:"baudrillard",  strength:2 },
  { from:"foucault",    to:"butler",       strength:3 },
  { from:"foucault",    to:"deleuze",      strength:2 },
  { from:"foucault",    to:"hooks",        strength:2 },
  { from:"foucault",    to:"zizek",        strength:2 },
  { from:"foucault",    to:"spivak",       strength:2 },
  { from:"foucault",    to:"said",         strength:3 },
  { from:"foucault",    to:"haraway",      strength:2 },
  { from:"foucault",    to:"mbembe",       strength:3 },
  { from:"foucault",    to:"klein",        strength:2 },
  { from:"foucault",    to:"harari",       strength:2 },
  { from:"derrida",     to:"butler",       strength:3 },
  { from:"derrida",     to:"spivak",       strength:3 },
  { from:"derrida",     to:"cixous",       strength:3 },
  { from:"derrida",     to:"hooks",        strength:1 },
  { from:"baudrillard", to:"zizek",        strength:2 },
  { from:"baudrillard", to:"bhabha",       strength:1 },
  { from:"baudrillard", to:"harari",       strength:1 },
  { from:"badiou",      to:"zizek",        strength:2 },
  { from:"badiou",      to:"mbembe",       strength:1 },
  { from:"deleuze",     to:"zizek",        strength:1 },
  { from:"irigaray",    to:"butler",       strength:2 },
  { from:"irigaray",    to:"cixous",       strength:2 },
  { from:"cixous",      to:"butler",       strength:2 },

  // Critical / Feminist
  { from:"lorde",       to:"hooks",        strength:2 },
  { from:"lorde",       to:"collins",      strength:2 },
  { from:"lorde",       to:"crenshaw",     strength:1 },
  { from:"lorde",       to:"haraway",      strength:1 },
  { from:"angela",      to:"hooks",        strength:2 },
  { from:"angela",      to:"west",         strength:2 },
  { from:"angela",      to:"mbembe",       strength:1 },
  { from:"hooks",       to:"butler",       strength:2 },
  { from:"hooks",       to:"crenshaw",     strength:1 },
  { from:"hooks",       to:"anzaldua",     strength:2 },
  { from:"hooks",       to:"collins",      strength:2 },
  { from:"haraway",     to:"bhabha",       strength:1 },
  { from:"haraway",     to:"mbembe",       strength:1 },
  { from:"collins",     to:"crenshaw",     strength:2 },
  { from:"young",       to:"nussbaum",     strength:1 },
  { from:"young",       to:"haraway",      strength:1 },
  { from:"young",       to:"angela",       strength:1 },
  { from:"shelley",     to:"haraway",      strength:2 },
  { from:"shelley",     to:"nussbaum",     strength:1 },
  { from:"sontag",      to:"hooks",        strength:1 },
  { from:"michelet",    to:"sontag",       strength:1 },
  { from:"michelet",    to:"harari",       strength:1 },

  // Contemporary
  { from:"macintyre",   to:"sandel",       strength:2 },
  { from:"macintyre",   to:"nussbaum",     strength:1 },
  { from:"macintyre",   to:"taylor",       strength:1 },
  { from:"macintyre",   to:"mcmullin",     strength:2 },
  { from:"taylor",      to:"sandel",       strength:1 },
  { from:"taylor",      to:"habermas",     strength:1 },
  { from:"taylor",      to:"mcmullin",     strength:2 },
  { from:"nagel",       to:"nussbaum",     strength:2 },
  { from:"singer",      to:"nussbaum",     strength:1 },
  { from:"dupuy",       to:"varoufakis",   strength:1 },
  { from:"dupuy",       to:"harari",       strength:1 },
  { from:"varoufakis",  to:"harari",       strength:1 },
  { from:"west",        to:"hooks",        strength:1 },
  { from:"nussbaum",    to:"mcmullin",     strength:1 },
  { from:"habermas",    to:"dupuy",        strength:2 },
];

const clusterColors = {
  ancient:          "#c9a84c",
  eastern:          "#a8d4a8",
  stoic:            "#d4b870",
  medieval:         "#9b8ea0",
  rationalist:      "#7fb3d3",
  earlymodern:      "#88b4a8",
  "german-idealism":"#8e6bbf",
  history:          "#d4a373",
  psychoanalysis:   "#e07b7b",
  analytic:         "#5b9bd5",
  frankfurt:        "#b5d97b",
  existential:      "#6dbf8e",
  poststructural:   "#d97be0",
  postcolonial:     "#e08c5c",
  cultural:         "#e0a85c",
  critical:         "#e05c8a",
  contemporary:     "#5cc8c8",
};

const clusterLabels = {
  ancient:          "Ancient Greek",
  eastern:          "Eastern Philosophy",
  stoic:            "Stoic",
  medieval:         "Medieval / Islamic",
  rationalist:      "Rationalist",
  earlymodern:      "Early Modern",
  "german-idealism":"German Idealism",
  history:          "Historiography",
  psychoanalysis:   "Psychoanalysis",
  analytic:         "Analytic / Linguistics",
  frankfurt:        "Frankfurt School",
  existential:      "Existentialism / Phenomenology",
  poststructural:   "Poststructuralism",
  postcolonial:     "Postcolonial",
  cultural:         "Cultural Criticism",
  critical:         "Critical / Feminist Theory",
  contemporary:     "Contemporary",
};

const clusterSummaries = {
  ancient: "Foundational Greek thinkers from the Pre-Socratics through Aristotle, who established philosophy's core questions about being, knowledge, ethics, and the good life through dialogue and rational inquiry.",
  eastern: "Daoist, Confucian, Buddhist, and modern Japanese traditions teaching wisdom through harmony with nature, ethical relationships, the emptiness of phenomena, and the unity of pure experience.",
  stoic: "A practical philosophy from Hellenistic Greece and Rome: virtue alone is sufficient for happiness; distinguish what is in our power from what is not; reason connects all rational beings.",
  medieval: "Christian, Islamic, and Jewish thinkers who synthesized ancient philosophy with revealed religion — debating faith and reason, the nature of God, universals, and the structure of being.",
  rationalist: "17th-century thinkers (Descartes, Spinoza, Leibniz, Kant) who held that reason — not the senses alone — is the primary source of knowledge, building ambitious metaphysical systems on a priori foundations.",
  earlymodern: "The intellectual revolution from the Renaissance through the Enlightenment: empiricism, the scientific method, social contract theory, and the foundations of modern political liberalism.",
  "german-idealism": "Post-Kantian philosophy (Hegel, Schopenhauer, Marx, Nietzsche, Kierkegaard) wrestling with consciousness, history, will, and reality — often through dialectical or revolutionary frameworks.",
  history: "Thinkers who treat history itself as a philosophical subject, asking how human collectivities make and interpret the past and what large patterns reveal about human nature.",
  psychoanalysis: "Beginning with Freud, the investigation of unconscious drives, repression, the formation of the self, and the symbolic structures of desire — reshaping philosophy, literature, and feminism.",
  analytic: "The Anglo-American tradition emphasizing logical clarity, philosophy of language, and rigorous argumentation — from Frege and Russell through Wittgenstein and Quine to contemporary political philosophy.",
  frankfurt: "Critical theorists (Adorno, Marcuse, Benjamin, Habermas) who fused Marx, Hegel, and Freud to diagnose how culture, ideology, and technology produce conformity in advanced capitalism.",
  existential: "From Husserl and Heidegger through Sartre, Beauvoir, and Levinas: the rigorous study of lived experience and the human condition — freedom, anxiety, embodiment, and responsibility to the Other.",
  poststructural: "French thinkers (Foucault, Derrida, Deleuze, Lacan) who interrogated how power, language, and difference construct knowledge and the subject — refusing stable structures and foundations.",
  postcolonial: "Thinkers (Fanon, Said, Spivak, Mbembe) who analyze how colonialism shapes consciousness, knowledge, and global power — and what genuine decolonization of mind and politics would require.",
  cultural: "Public intellectuals who turn philosophical attention to images, art, illness, war, and everyday life as serious objects of theoretical reflection.",
  critical: "Feminist, Black feminist, and queer theorists who expose how gender, race, sexuality, and class intersect to produce oppression — and how identity, performance, and solidarity might transform it.",
  contemporary: "Living and recent philosophers across virtue ethics, capabilities, communitarianism, animal rights, technology, and political economy — bringing philosophy to bear on urgent present problems.",
};

const positions = {
  // Eastern — top-left lane
  laozi:        { x: 60,   y: 30  },
  confucius:    { x: 60,   y: 120 },
  zhuangzi:     { x: 160,  y: 70  },
  nagarjuna:    { x: 200,  y: 160 },
  nishida:      { x: 1180, y: 640 },
  // Pre-Socratic
  heraclitus:   { x: 60,   y: 260 },
  parmenides:   { x: 60,   y: 380 },
  thucydides:   { x: 60,   y: 500 },
  // Socratic / Ancient
  socrates:     { x: 190,  y: 300 },
  plato:        { x: 290,  y: 200 },
  aristotle:    { x: 290,  y: 400 },
  hypatia:      { x: 370,  y: 120 },
  // Stoic
  zeno:         { x: 190,  y: 500 },
  chrysippus:   { x: 270,  y: 570 },
  seneca:       { x: 350,  y: 640 },
  epictetus:    { x: 370,  y: 540 },
  marcus:       { x: 450,  y: 600 },
  // Medieval
  plotinus:     { x: 370,  y: 210 },
  augustine:    { x: 450,  y: 140 },
  pizan:        { x: 330,  y: 480 },
  alfarabi:     { x: 420,  y: 310 },
  avicenna:     { x: 490,  y: 230 },
  averroes:     { x: 510,  y: 340 },
  hildegard:    { x: 410,  y: 430 },
  aquinas:      { x: 570,  y: 270 },
  ibn_khaldun:  { x: 470,  y: 520 },
  // Early Modern
  erasmus:      { x: 490,  y: 140 },
  montaigne:    { x: 550,  y: 110 },
  machiavelli:  { x: 570,  y: 440 },
  bacon:        { x: 590,  y: 380 },
  hobbes:       { x: 610,  y: 310 },
  descartes:    { x: 650,  y: 175 },
  pascal:       { x: 600,  y: 200 },
  spinoza:      { x: 690,  y: 285 },
  locke:        { x: 690,  y: 415 },
  leibniz:      { x: 730,  y: 120 },
  voltaire:     { x: 670,  y: 490 },
  hume:         { x: 710,  y: 200 },
  rousseau:     { x: 730,  y: 470 },
  adamsmith:    { x: 750,  y: 560 },
  bentham:      { x: 770,  y: 430 },
  kant:         { x: 790,  y: 310 },
  wollstonecraft:{ x: 770, y: 545 },
  shelley:      { x: 850,  y: 610 },
  // German Idealism
  hegel:        { x: 870,  y: 225 },
  schopenhauer: { x: 850,  y: 115 },
  michelet:     { x: 910,  y: 105 },
  mill:         { x: 830,  y: 490 },
  kierkegaard:  { x: 910,  y: 380 },
  marx:         { x: 930,  y: 510 },
  nietzsche:    { x: 955,  y: 295 },
  engels:       { x: 870,  y: 575 },
  webb:         { x: 970,  y: 585 },
  luxemburg:    { x: 1030, y: 545 },
  kollontai:    { x: 1070, y: 620 },
  // Analytic
  peirce:       { x: 890,  y: 445 },
  frege:        { x: 870,  y: 60  },
  james:        { x: 960,  y: 455 },
  saussure:     { x: 970,  y: 60  },
  dewey:        { x: 1010, y: 445 },
  russell:      { x: 990,  y: 140 },
  wittgenstein: { x: 1070, y: 205 },
  popper:       { x: 1175, y: 265 },
  quine:        { x: 1125, y: 65  },
  rawls:        { x: 1235, y: 490 },
  chomsky:      { x: 1155, y: 145 },
  // Psychoanalysis
  freud:        { x: 1030, y: 285 },
  jung:         { x: 1090, y: 330 },
  lacan:        { x: 1110, y: 235 },
  frankl:       { x: 1130, y: 390 },
  // Frankfurt
  gramsci:      { x: 1070, y: 500 },
  benjamin:     { x: 1090, y: 455 },
  adorno:       { x: 1170, y: 390 },
  marcuse:      { x: 1190, y: 495 },
  habermas:     { x: 1270, y: 305 },
  // Phenomenology / Existential
  bergson:      { x: 1010, y: 565 },
  husserl:      { x: 1070, y: 65  },
  heidegger:    { x: 1170, y: 105 },
  levinas:      { x: 1250, y: 125 },
  arendt:       { x: 1235, y: 205 },
  merleau:      { x: 1215, y: 385 },
  beauvoir:     { x: 1315, y: 280 },
  weil:         { x: 1210, y: 570 },
  sartre:       { x: 1295, y: 165 },
  ricoeur:      { x: 1290, y: 65  },
  camus:        { x: 1355, y: 105 },
  // Postcolonial
  dubois:       { x: 1040, y: 630 },
  senghor:      { x: 1235, y: 640 },
  cesaire:      { x: 1315, y: 575 },
  fanon:        { x: 1375, y: 495 },
  said:         { x: 1395, y: 415 },
  spivak:       { x: 1495, y: 455 },
  anzaldua:     { x: 1475, y: 575 },
  bhabha:       { x: 1455, y: 375 },
  mbembe:       { x: 1495, y: 530 },
  // Poststructural
  borges:       { x: 1330, y: 380 },
  deleuze:      { x: 1375, y: 105 },
  foucault:     { x: 1395, y: 205 },
  baudrillard:  { x: 1495, y: 250 },
  derrida:      { x: 1415, y: 315 },
  badiou:       { x: 1535, y: 165 },
  zizek:        { x: 1455, y: 210 },
  // Critical / Feminist
  irigaray:     { x: 1435, y: 395 },
  sontag:       { x: 1435, y: 470 },
  cixous:       { x: 1475, y: 320 },
  lorde:        { x: 1515, y: 395 },
  angela:       { x: 1575, y: 395 },
  hooks:        { x: 1515, y: 490 },
  haraway:      { x: 1555, y: 310 },
  butler:       { x: 1555, y: 280 },
  collins:      { x: 1535, y: 545 },
  crenshaw:     { x: 1575, y: 490 },
  young:        { x: 1595, y: 185 },
  west:         { x: 1615, y: 500 },
  // Contemporary
  macintyre:    { x: 1615, y: 420 },
  taylor:       { x: 1615, y: 365 },
  nagel:        { x: 1595, y: 245 },
  singer:       { x: 1615, y: 290 },
  nussbaum:     { x: 1575, y: 145 },
  sandel:       { x: 1595, y: 575 },
  mcmullin:     { x: 1655, y: 325 },
  dupuy:        { x: 1655, y: 420 },
  varoufakis:   { x: 1655, y: 510 },
  harari:       { x: 1655, y: 585 },
  klein:        { x: 1635, y: 555 },
};

export default function PhilosopherMap() {
  const [selected, setSelected] = useState(null);
  const [hovered,  setHovered]  = useState(null);
  const [hoveredCluster, setHoveredCluster] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [zoom, setZoom] = useState(0.44);
  const [pan,  setPan]  = useState({ x: 10, y: 20 });
  const [dragging,  setDragging]  = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [chatHistories, setChatHistories] = useState({});
  const [chatInputs,    setChatInputs]    = useState({});
  const [chatLoading,   setChatLoading]   = useState({});
  const chatEndRef = useRef(null);

  const activeId = hovered || selected;

  const isConnected = (id) => {
    if (selectedCluster) {
      const ph = philosophers.find(p => p.id === id);
      return ph?.cluster === selectedCluster;
    }
    if (!activeId) return true;
    if (id === activeId) return true;
    return influences.some(i => (i.from === activeId && i.to === id) || (i.to === activeId && i.from === id));
  };

  const getConnections = (id) => ({
    influenced:   influences.filter(i => i.from === id).map(i => i.to),
    influencedBy: influences.filter(i => i.to   === id).map(i => i.from),
  });

  const activePhil  = activeId ? philosophers.find(p => p.id === activeId) : null;
  const connections = activeId ? getConnections(activeId) : null;

  const sendChat = async (philId) => {
    const phil = philosophers.find(p => p.id === philId);
    const question = (chatInputs[philId] || "").trim();
    if (!question || chatLoading[philId]) return;
    const influenced   = influences.filter(i => i.from === philId).map(i => philosophers.find(p=>p.id===i.to)?.name).filter(Boolean);
    const influencedBy = influences.filter(i => i.to   === philId).map(i => philosophers.find(p=>p.id===i.from)?.name).filter(Boolean);
    const systemPrompt = `You are an expert philosophy tutor. The user is exploring a philosophical influence map and has selected ${phil.name} (${phil.dates}), who belongs to the ${clusterLabels[phil.cluster]} tradition.

Key facts about ${phil.name}:
- Bio: ${phil.bio}
- Influenced by: ${influencedBy.length ? influencedBy.join(", ") : "none mapped"}
- Influenced: ${influenced.length ? influenced.join(", ") : "none mapped"}

Answer the user's question clearly and engagingly. Be concise but substantive — 2-4 sentences unless more is warranted. Relate answers to other philosophers on the map when relevant. Write in flowing prose, no bullet points.`;
    const prevHistory = chatHistories[philId] || [];
    const newUserMsg  = { role: "user", content: question };
    const updatedHistory = [...prevHistory, newUserMsg];
    setChatHistories(h => ({ ...h, [philId]: updatedHistory }));
    setChatInputs(i => ({ ...i, [philId]: "" }));
    setChatLoading(l => ({ ...l, [philId]: true }));
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: updatedHistory,
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Sorry, I couldn't get a response.";
      setChatHistories(h => ({ ...h, [philId]: [...updatedHistory, { role: "assistant", content: reply }] }));
    } catch {
      setChatHistories(h => ({ ...h, [philId]: [...updatedHistory, { role: "assistant", content: "Error reaching the API. Please try again." }] }));
    }
    setChatLoading(l => ({ ...l, [philId]: false }));
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistories, selected]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setZoom(z => Math.min(3, Math.max(0.2, z * (e.deltaY > 0 ? 0.92 : 1.08))));
  }, []);
  const handleMouseDown = (e) => {
    if (e.target.closest("[data-node]")) return;
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = (e) => {
    if (!dragging || !dragStart) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setDragging(false);

  return (
    <div style={{ background:"#0d0d14", height:"100vh", fontFamily:"Georgia,serif", color:"#e8e0d0",
                  display:"flex", flexDirection:"column", overflow:"hidden", userSelect:"none" }}>
      <div style={{ padding:"10px 20px 8px", borderBottom:"1px solid #1a1a28",
                    display:"flex", alignItems:"center", gap:14, flexShrink:0 }}>
        <h1 style={{ fontSize:16, fontWeight:"normal", letterSpacing:"0.12em",
                     color:"#c9b97a", margin:0, textTransform:"uppercase" }}>
          Philosophical Influence Map
        </h1>
        <span style={{ color:"#8a8278", fontSize:11 }}>
          {philosophers.length} thinkers · {Object.keys(clusterLabels).length} traditions · scroll to zoom · drag to pan · click to explore
        </span>
        <button onClick={() => { setZoom(0.44); setPan({ x:10, y:20 }); }}
          style={{ marginLeft:"auto", background:"transparent", border:"1px solid #1e1e30",
                   color:"#8a8278", fontSize:10, letterSpacing:"0.07em", cursor:"pointer",
                   padding:"4px 10px", borderRadius:3, textTransform:"uppercase", fontFamily:"Georgia,serif" }}>
          Reset View
        </button>
      </div>

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        <div style={{ flex:1, position:"relative", overflow:"hidden", cursor: dragging ? "grabbing" : "grab" }}
          onWheel={handleWheel} onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          <svg style={{ width:"100%", height:"100%" }}>
            <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
              {influences.map((inf, i) => {
                const from = positions[inf.from];
                const to   = positions[inf.to];
                if (!from || !to) return null;
                const isActive = activeId && (inf.from === activeId || inf.to === activeId);
                const fade     = (activeId && !isActive) || selectedCluster;
                const fc = clusterColors[philosophers.find(p => p.id === inf.from)?.cluster] || "#888";
                const tc = clusterColors[philosophers.find(p => p.id === inf.to  )?.cluster] || "#888";
                const dx = to.x - from.x, dy = to.y - from.y;
                const cx = from.x + dx*0.5 + dy*0.15;
                const cy = from.y + dy*0.5 - dx*0.06;

                // Position along the quadratic bezier curve at parameter t (0 = source, 1 = destination)
                const bez = (t) => ({
                  x: (1-t)**2*from.x + 2*(1-t)*t*cx + t**2*to.x,
                  y: (1-t)**2*from.y + 2*(1-t)*t*cy + t**2*to.y,
                });

                // Two arrowheads pointing in the direction of influence
                const a1 = bez(0.22), a1b = bez(0.12);  // source-side
                const a2 = bez(0.85), a2b = bez(0.75);  // destination-side
                const ang1 = Math.atan2(a1.y - a1b.y, a1.x - a1b.x) * 180/Math.PI;
                const ang2 = Math.atan2(a2.y - a2b.y, a2.x - a2b.x) * 180/Math.PI;

                const gid = `g${i}`;
                return (
                  <g key={i}>
                    <defs>
                      <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor={fc} stopOpacity={fade?0.02:isActive?0.65:0.13}/>
                        <stop offset="100%" stopColor={tc} stopOpacity={fade?0.02:isActive?0.65:0.13}/>
                      </linearGradient>
                    </defs>
                    <path d={`M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`}
                      fill="none" stroke={`url(#${gid})`}
                      strokeWidth={isActive ? inf.strength*2 : inf.strength*0.35}
                      strokeLinecap="round"/>
                    {isActive && (
                      <>
                        <polygon points="0,-3 6.5,0 0,3" fill={tc} opacity={0.85}
                          transform={`translate(${a1.x},${a1.y}) rotate(${ang1})`}/>
                        <polygon points="0,-3 6.5,0 0,3" fill={tc} opacity={0.95}
                          transform={`translate(${a2.x},${a2.y}) rotate(${ang2})`}/>
                      </>
                    )}
                  </g>
                );
              })}
              {philosophers.map((p) => {
                const pos = positions[p.id];
                if (!pos) return null;
                const color  = clusterColors[p.cluster] || "#888";
                const active = p.id === activeId;
                const fade   = (activeId || selectedCluster) && !isConnected(p.id);
                return (
                  <g key={p.id} data-node="true"
                    transform={`translate(${pos.x},${pos.y})`} style={{ cursor:"pointer" }}
                    onClick={(e) => { e.stopPropagation(); setSelected(selected === p.id ? null : p.id); }}
                    onMouseEnter={() => setHovered(p.id)}
                    onMouseLeave={() => setHovered(null)}>
                    {active && <circle r={20} fill={color} opacity={0.13}/>}
                    <circle r={active?11:7}
                      fill={fade?"#0f0f1c":color} opacity={fade?0.18:1}
                      stroke={active?"#fff":"none"} strokeWidth={active?1.5:0}/>
                    <circle r={2} fill={fade?"#181828":"#0d0d14"} opacity={fade?0.2:1}/>
                    <text y={active?-16:-12} textAnchor="middle"
                      fontSize={active?10.5:8} fontFamily="Georgia,serif"
                      fill={fade?"#1e1e2e":active?"#fff":"#8a8278"}
                      fontWeight={active?"bold":"normal"} letterSpacing="0.02em"
                      style={{ pointerEvents:"none" }}>
                      {p.name}
                    </text>
                    {active && (
                      <text y={26} textAnchor="middle" fontSize={7.5} fontFamily="Georgia,serif"
                        fill={color} opacity={0.65} style={{ pointerEvents:"none" }}>
                        {p.dates}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Sidebar */}
        <div style={{ width:340, borderLeft:"1px solid #121222", padding:"18px 16px",
                      overflowY:"auto", background:"#06060e", flexShrink:0 }}>
          {!activePhil ? (
            <>
              <p style={{ color:"#a8a098", fontSize:12, letterSpacing:"0.09em",
                          textTransform:"uppercase", marginBottom:14, marginTop:0 }}>Traditions</p>
              {Object.entries(clusterLabels).map(([key, label]) => {
                const isSel = selectedCluster === key;
                const dimmed = (hoveredCluster && hoveredCluster !== key) ||
                               (selectedCluster && selectedCluster !== key);
                return (
                  <div key={key}
                    onMouseEnter={() => setHoveredCluster(key)}
                    onMouseLeave={() => setHoveredCluster(null)}
                    onClick={() => {
                      setSelectedCluster(isSel ? null : key);
                      setSelected(null);
                    }}
                    style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8,
                             cursor:"pointer",
                             opacity: dimmed ? 0.35 : 1,
                             transition:"opacity 0.15s" }}>
                    <div style={{ width:9, height:9, borderRadius:"50%",
                                  background:clusterColors[key], flexShrink:0,
                                  boxShadow: isSel ? `0 0 0 2px ${clusterColors[key]}66` : "none" }}/>
                    <span style={{ color: (isSel || hoveredCluster === key) ? clusterColors[key] : "#5e5868",
                                   fontSize:12, fontWeight: isSel ? "bold" : "normal",
                                   transition:"color 0.15s" }}>{label}</span>
                  </div>
                );
              })}
              {selectedCluster && (
                <button onClick={() => setSelectedCluster(null)}
                  style={{ marginTop:8, padding:"5px 10px", background:"transparent",
                           border:`1px solid ${clusterColors[selectedCluster]}55`,
                           color: clusterColors[selectedCluster], fontSize:10,
                           letterSpacing:"0.09em", textTransform:"uppercase",
                           cursor:"pointer", borderRadius:3, width:"100%", fontFamily:"Georgia,serif" }}>
                  Clear Selection
                </button>
              )}
              <div style={{ marginTop:18, padding:"12px 14px", background:"#0a0a18",
                            borderRadius:4,
                            border: hoveredCluster
                              ? `1px solid ${clusterColors[hoveredCluster]}55`
                              : "1px solid #131323",
                            transition:"border-color 0.15s" }}>
                {hoveredCluster ? (
                  <>
                    <p style={{ color:clusterColors[hoveredCluster], fontSize:12,
                                letterSpacing:"0.06em", textTransform:"uppercase",
                                margin:"0 0 8px", fontWeight:"bold" }}>
                      {clusterLabels[hoveredCluster]}
                    </p>
                    <p style={{ color:"#a8a098", fontSize:12.5, lineHeight:1.7, margin:0 }}>
                      {clusterSummaries[hoveredCluster]}
                    </p>
                  </>
                ) : (
                  <p style={{ color:"#a8a098", fontSize:12, lineHeight:1.85, margin:0 }}>
                    Arrow → direction of influence<br/>
                    Line thickness = strength<br/><br/>
                    Click a node to see bio,<br/>
                    connections, Wikipedia link<br/>
                    & chat feature.<br/><br/>
                    Hover a tradition above for a summary.
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom:11 }}>
                <div style={{ width:8, height:8, borderRadius:"50%",
                              background:clusterColors[activePhil.cluster], display:"inline-block", marginRight:7 }}/>
                <span style={{ color:"#3a3a52", fontSize:11, textTransform:"uppercase", letterSpacing:"0.09em" }}>
                  {clusterLabels[activePhil.cluster]}
                </span>
              </div>
              <h2 style={{ fontSize:19, fontWeight:"normal", color:clusterColors[activePhil.cluster], margin:"0 0 3px" }}>
                {activePhil.name}
              </h2>
              <p style={{ color:"#3a3a52", fontSize:12, margin:"0 0 11px" }}>{activePhil.dates}</p>
              <p style={{ color:"#8c8478", fontSize:12.5, lineHeight:1.75, margin:"0 0 13px",
                          borderLeft:`2px solid ${clusterColors[activePhil.cluster]}`, paddingLeft:10 }}>
                {activePhil.bio}
              </p>
              {activePhil.wiki && (
                <a href={activePhil.wiki} target="_blank" rel="noreferrer"
                  style={{ display:"inline-flex", alignItems:"center", gap:5,
                           color:clusterColors[activePhil.cluster], fontSize:11.5,
                           textDecoration:"none", border:`1px solid ${clusterColors[activePhil.cluster]}55`,
                           padding:"5px 10px", borderRadius:3, marginBottom:15,
                           fontFamily:"Georgia,serif", letterSpacing:"0.04em" }}>
                  ↗ Wikipedia
                </a>
              )}
              {connections?.influencedBy.length > 0 && (
                <div style={{ marginBottom:12 }}>
                  <p style={{ color:"#3a3a52", fontSize:11, textTransform:"uppercase", letterSpacing:"0.09em", marginBottom:6 }}>← Influenced by</p>
                  {connections.influencedBy.map(id => {
                    const ph = philosophers.find(p => p.id === id);
                    return (
                      <div key={id} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5, cursor:"pointer" }}
                        onClick={() => setSelected(id)}>
                        <div style={{ width:7, height:7, borderRadius:"50%", background:clusterColors[ph?.cluster], flexShrink:0 }}/>
                        <span style={{ color:"#7a7268", fontSize:12 }}>
                          {ph?.name}<span style={{ color:"#2e2e44", fontSize:10.5, marginLeft:5 }}>{ph?.dates}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              {connections?.influenced.length > 0 && (
                <div style={{ marginBottom:12 }}>
                  <p style={{ color:"#3a3a52", fontSize:11, textTransform:"uppercase", letterSpacing:"0.09em", marginBottom:6 }}>→ Influenced</p>
                  {connections.influenced.map(id => {
                    const ph = philosophers.find(p => p.id === id);
                    return (
                      <div key={id} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5, cursor:"pointer" }}
                        onClick={() => setSelected(id)}>
                        <div style={{ width:7, height:7, borderRadius:"50%", background:clusterColors[ph?.cluster], flexShrink:0 }}/>
                        <span style={{ color:"#7a7268", fontSize:12 }}>
                          {ph?.name}<span style={{ color:"#2e2e44", fontSize:10.5, marginLeft:5 }}>{ph?.dates}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              <button onClick={() => setSelected(null)}
                style={{ marginTop:5, padding:"6px 11px", background:"transparent",
                         border:"1px solid #1a1a2e", color:"#3a3a52", fontSize:11,
                         letterSpacing:"0.09em", textTransform:"uppercase",
                         cursor:"pointer", borderRadius:3, width:"100%", fontFamily:"Georgia,serif" }}>
                Clear
              </button>

              {/* Chat */}
              <div style={{ marginTop:18, borderTop:"1px solid #131323", paddingTop:14 }}>
                <p style={{ color:"#3a3a52", fontSize:11, textTransform:"uppercase",
                            letterSpacing:"0.09em", margin:"0 0 10px" }}>
                  Ask about {activePhil.name}
                </p>
                {(chatHistories[activePhil.id] || []).length > 0 && (
                  <div style={{ maxHeight:280, overflowY:"auto", marginBottom:10,
                                display:"flex", flexDirection:"column", gap:8 }}>
                    {(chatHistories[activePhil.id] || []).map((msg, i) => (
                      <div key={i} style={{
                        alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                        maxWidth:"91%",
                        background: msg.role === "user" ? `${clusterColors[activePhil.cluster]}22` : "#0e0e1c",
                        border: msg.role === "user" ? `1px solid ${clusterColors[activePhil.cluster]}44` : "1px solid #1a1a2e",
                        borderRadius: msg.role === "user" ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
                        padding:"8px 11px",
                      }}>
                        <p style={{ margin:0, fontSize:12, lineHeight:1.7,
                                    color: msg.role === "user" ? clusterColors[activePhil.cluster] : "#8c8478",
                                    fontFamily:"Georgia,serif" }}>
                          {msg.content}
                        </p>
                      </div>
                    ))}
                    {chatLoading[activePhil.id] && (
                      <div style={{ alignSelf:"flex-start", padding:"8px 13px", background:"#0e0e1c",
                                    border:"1px solid #1a1a2e", borderRadius:"10px 10px 10px 2px" }}>
                        <span style={{ color:"#4a4a62", fontSize:11, letterSpacing:"0.1em" }}>thinking…</span>
                      </div>
                    )}
                    <div ref={chatEndRef}/>
                  </div>
                )}
                <div style={{ display:"flex", gap:7 }}>
                  <input
                    value={chatInputs[activePhil.id] || ""}
                    onChange={e => setChatInputs(ci => ({ ...ci, [activePhil.id]: e.target.value }))}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(activePhil.id); }}}
                    placeholder={`Ask anything about ${activePhil.name}…`}
                    style={{ flex:1, background:"#0a0a18", border:"1px solid #1a1a2e",
                             borderRadius:4, padding:"8px 11px", color:"#8c8478",
                             fontSize:12, fontFamily:"Georgia,serif", outline:"none",
                             caretColor: clusterColors[activePhil.cluster] }}
                  />
                  <button onClick={() => sendChat(activePhil.id)}
                    disabled={chatLoading[activePhil.id] || !chatInputs[activePhil.id]?.trim()}
                    style={{ background: clusterColors[activePhil.cluster], border:"none",
                             borderRadius:4, padding:"8px 13px", color:"#0d0d14",
                             fontSize:13, cursor:"pointer", fontFamily:"Georgia,serif", fontWeight:"bold",
                             opacity: (chatLoading[activePhil.id] || !chatInputs[activePhil.id]?.trim()) ? 0.35 : 1 }}>
                    ↑
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

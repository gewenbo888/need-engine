import { Bi } from "./lang";

/* ============================================================= *
 *  NEED ENGINE · content model
 *  Single source of truth for all bilingual copy + viz data.
 *  Every visualization imports its data from here.
 * ============================================================= */

/* ---------- 10 core sections ---------- */
export type Section = { num: string; id: string; title: Bi; sub: Bi; body: Bi };

export const SECTIONS: Section[] = [
  {
    num: "01", id: "origin",
    title: { en: "The Origin of Need", zh: "需求的起源" },
    sub: { en: "How survival pressure first wrote desire into living matter", zh: "生存压力，如何最初将欲望写入活物之中" },
    body: {
      en: "A need is older than any mind. Before there were brains to feel longing, there were chemical gradients that a bacterium had to climb to survive — toward sugar, away from acid. That single bias, approach the good and avoid the bad, is the seed of everything that follows. Evolution does not build creatures that want to live; it builds creatures that behave as if they do, by installing internal signals that hurt when a vital quantity drops and reward when it is restored. Hunger is a low blood-sugar alarm wearing the clothing of feeling. Thirst, fear, lust, the ache of loneliness — each is a survival variable made conscious, a gap between the body's actual state and the state its genes require. Needs, in this oldest sense, are not flaws in an otherwise complete being. They are the mechanism by which incomplete beings stay alive: a permanent, productive dissatisfaction that points behavior at the world. Climb the tree of life and the needs accumulate — metabolic, then defensive, then reproductive, then social — but the logic never changes. To need is to be a system that must reach outside itself to continue.",
      zh: "需求，比任何心智都更古老。在还没有大脑去感受渴望之前，就已有化学浓度梯度，一只细菌必须沿之攀爬才能存活——朝向糖，远离酸。那一个简单的偏向——趋近好的、避开坏的——便是此后一切的种子。演化并不打造「想要活着」的生物；它打造「行为上仿佛想活着」的生物，办法是植入内在信号：当某个攸关生死的量下降时令其痛苦，恢复时予以奖赏。饥饿，是一只穿着感觉外衣的低血糖警报。口渴、恐惧、情欲、孤独的隐痛——每一样，都是一个被意识化了的生存变量，是身体的实际状态与基因所要求的状态之间的一道缺口。在这最古老的意义上，需求并非一个本应完整之存在身上的瑕疵。它们恰是不完整的存在赖以活下去的机制：一种永久而富有生产力的不满足，把行为指向世界。沿生命之树向上攀爬，需求不断累积——先是代谢的，再是防御的，再是繁殖的，再是社会的——但其逻辑从未改变。所谓「需要」，就是成为一个必须伸向自身之外、才能延续的系统。",
    },
  },
  {
    num: "02", id: "brain",
    title: { en: "The Brain & the Machinery of Motivation", zh: "大脑与动机的机器" },
    sub: { en: "Dopamine, reward prediction, and why wanting is not liking", zh: "多巴胺、奖赏预测，以及「想要」为何不等于「喜欢」" },
    body: {
      en: "The brain does not run on pleasure; it runs on the prediction of pleasure. The central discovery of motivation neuroscience is that dopamine — long mislabeled the 'pleasure chemical' — does not signal reward. It signals reward prediction error: the gap between what you expected and what you got. A reward you fully predicted releases nothing; a reward that arrives unannounced floods the system; an expected reward that fails to come produces a dip felt as disappointment. This is the same mathematics that trains an artificial reinforcement learner. It explains why the wanting and the liking come apart — why an addict can crave a drug they no longer enjoy, why the notification is more compelling than the message, why the chase so often beats the having. 'Wanting' is a dopaminergic engine that learns to fire at the cues that predict reward, dragging behavior toward them; 'liking' is a separate, smaller opioid system that registers the brief pleasure of consumption. Habits form when a cue, a routine, and a reward repeat until the dopamine spike migrates from the reward to the cue, and the loop runs without deciding to. We are not built to be satisfied. We are built to keep predicting, keep pursuing, and to treat each attained goal as the new baseline from which the next gap opens.",
      zh: "大脑并非以快感为燃料运行；它以对快感的预测为燃料。动机神经科学的核心发现是：多巴胺——长期被误称为「快感分子」——并不标记奖赏本身。它标记的是奖赏预测误差：你所期待的与你所得到的之间的落差。一个被你完全预测到的奖赏，什么也不释放；一个不期而至的奖赏，会让系统泛滥；一个被期待却落空的奖赏，则产生一次被体验为失望的下陷。这与训练一个人工强化学习体的，是同一套数学。它解释了为何「想要」与「喜欢」会彼此分离——为何一个成瘾者会渴求一种他早已不再享受的药物，为何那条通知比信息本身更诱人，为何追逐如此频繁地胜过拥有。「想要」，是一台多巴胺引擎，它学会在那些预示奖赏的线索上放电，把行为拖向它们；「喜欢」，则是另一个更小的阿片系统，登记着消费那一刻短暂的愉悦。习惯的形成，是当线索、惯例与奖赏不断重复，直到多巴胺的尖峰从奖赏迁移到线索，于是回路无须决定便自行运转。我们并非被造来满足的。我们被造来不断预测、不断追逐，并把每一个已达成的目标，当作下一道缺口由之裂开的新基线。",
    },
  },
  {
    num: "03", id: "status",
    title: { en: "Maslow, Status & the Social Self", zh: "马斯洛、地位与社会性自我" },
    sub: { en: "Needs beyond survival: belonging, esteem, recognition, identity", zh: "生存之上的需求：归属、尊重、认可、身份" },
    body: {
      en: "Once survival is loosely secured, a stranger set of needs takes over — and for social animals these are no less real. We need to belong, to be seen, to matter in the eyes of others, to know who we are. Maslow arranged such needs into a hierarchy rising from the physiological through safety, belonging and esteem to self-actualization, and the picture is useful even if real lives ignore its tidy order: the starving artist, the martyr, the lover who forgets to eat. What the pyramid understates is how thoroughly the social needs colonize the rest. Humans are status-seeking animals to the marrow, because for most of our evolution rank determined who ate, who mated, who survived the lean year. Every culture builds a machine for converting raw desire into positional striving, but they tune it differently: Confucian honor binds esteem to one's role and the regard of family and sovereign; aristocratic codes fix it to bloodline and conspicuous leisure; the modern attention economy melts it into a live, quantified scoreboard of likes, followers and views that never closes. Identity itself becomes a need — a story we must keep authoring and defending. The deep point is that beyond a thin floor of calories, most of what humans relentlessly pursue is not the thing itself but its meaning to others, and to the self that watches itself being watched.",
      zh: "一旦生存被大致保障，一组更奇特的需求便接管过来——而对社会性动物而言，它们丝毫不更虚幻。我们需要归属、需要被看见、需要在他人眼中有分量、需要知道自己是谁。马斯洛把这些需求排成一座金字塔，从生理，经由安全、归属与尊重，升向自我实现；即便真实的人生常常无视它整洁的次序——挨饿的艺术家、殉道者、忘了吃饭的恋人——这幅图景依然有用。金字塔所低估的，是社会性需求如何彻底地殖民了其余一切。人类是深入骨髓的地位追逐动物，因为在我们演化的大部分时间里，等级决定了谁能进食、谁能交配、谁能熬过歉收之年。每一种文化都建造一台机器，把原始欲望转化为位置性的争胜，但各自的调校不同：儒家的荣誉把尊重系于一个人的角色，以及家族与君主的看待；贵族的法典把它固定于血统与炫示性的闲暇；而现代的注意力经济，则把它熔化成一块实时的、被量化的记分牌——点赞、粉丝与浏览量，永不收盘。身份本身也成了一种需求——一个我们必须持续撰写并捍卫的故事。其深意在于：在那层薄薄的卡路里地板之上，人类锲而不舍追逐的，大多不是事物本身，而是它对他人的意义，以及对那个看着自己被看着的自我的意义。",
    },
  },
  {
    num: "04", id: "economics",
    title: { en: "Markets, Consumption & the Demand Machine", zh: "市场、消费与需求机器" },
    sub: { en: "How economies discover, amplify, and manufacture desire", zh: "经济体如何发现、放大并制造欲望" },
    body: {
      en: "An economy is, at bottom, a vast machine for sensing what people want and reorganizing matter and labor to supply it. Prices are its nervous system: a high price is a need shouting, a falling one a need met. For most of history production was the bottleneck — too few goods chasing urgent needs — and the central problem was scarcity. Industrial capitalism solved scarcity so well for so many goods that it inverted the problem: now the constraint is demand. A factory that can make more shoes than anyone needs must somehow create the wanting. This is the hinge on which the modern world turns. Advertising, branding, fashion, planned obsolescence, the luxury industries and the engineered novelty cycle are not incidental to capitalism; they are its solution to the surplus problem — an apparatus for manufacturing dissatisfaction at the rate required to keep the machine running. A brand sells not a product but an identity; a luxury good sells not utility but a position; an advertisement sells not information but a small, repeatable ache. None of this is simply manipulation imposed on passive victims — it works precisely because it plugs into the real status, belonging and identity needs of section three. The economy did not invent desire. It learned to read it, amplify it, and increasingly to author it, until a civilization that began by allocating scarce bread now spends its vast surplus chasing wants it largely creates.",
      zh: "一个经济体，归根结底，是一台庞大的机器，用以感知人们想要什么，并重组物质与劳动去供给它。价格是它的神经系统：高价是一个需求在呐喊，跌落则是一个需求被满足。在历史的大部分时间里，生产才是瓶颈——太少的货物追逐着紧迫的需求——核心难题是稀缺。工业资本主义把许多货物的稀缺解决得如此之好，以至于把问题颠倒了过来：如今，约束变成了需求本身。一座能造出多过任何人所需之鞋的工厂，必须设法把「想要」制造出来。这正是现代世界赖以转动的枢轴。广告、品牌、时尚、计划性淘汰、奢侈品产业与被设计出来的新奇循环，对资本主义而言并非可有可无；它们正是它对盈余难题的解法——一套以维持机器运转所需之速率来制造不满足的装置。一个品牌出售的不是产品，而是一种身份；一件奢侈品出售的不是效用，而是一个位置；一则广告出售的不是信息，而是一阵微小而可重复的隐痛。这一切并非只是强加于被动受害者之上的操纵——它之所以奏效，恰恰因为它接入了第三节所说那些真实的地位、归属与身份需求。经济并未发明欲望。它学会了读取它、放大它，并越来越多地撰写它，直到一个以分配稀缺面包起家的文明，如今把它庞大的盈余，花在追逐那些大半由它自己创造出来的欲求上。",
    },
  },
  {
    num: "05", id: "technology",
    title: { en: "The Engineering of Desire", zh: "欲望的工程化" },
    sub: { en: "Algorithms, feeds, and the industrialization of attention", zh: "算法、信息流，与注意力的工业化" },
    body: {
      en: "If twentieth-century capitalism learned to manufacture desire at the scale of the broadcast, the twenty-first learned to manufacture it at the scale of the individual, in real time, with a feedback loop. A recommendation engine does not show you what is true or good; it shows you what maximizes a measured behavior — usually time spent or clicks — and then learns from your response, sharpening its model of your wanting with every scroll. The result is the most powerful desire-shaping apparatus ever built, and it runs on principles the casino discovered first: the variable-ratio reward, where unpredictable payoff is the most compelling schedule of all; the infinite feed that removes every natural stopping cue; the social-validation drip metered out to keep you returning to check. These systems are not evil; they are optimizers pointed at the wrong target. Asked to maximize engagement, they discover that outrage, novelty, comparison and fear are engaging, and they amplify whatever in you responds. Personalization means the apparatus increasingly knows your specific cravings better than you do, and can present the cue before you consciously feel the want. The open question of our era is one of sovereignty: when a machine can predict and trigger your desires faster than you can reflect on them, in what sense are they still yours? The attention economy has made human wanting itself the scarce resource over which the most advanced technology on Earth now competes.",
      zh: "如果说二十世纪的资本主义学会了以广播的尺度制造欲望，二十一世纪则学会了以个体的尺度、实时地、带着一个反馈回路去制造它。一个推荐引擎不会向你展示什么是真的或好的；它展示的是能最大化某个被测量行为的东西——通常是停留时长或点击——然后从你的反应中学习，每一次滑动都让它对你的「想要」之模型更加锋利。其结果，是有史以来最强大的欲望塑造装置，而它所依凭的原理，是赌场最先发现的：变动比率奖赏——不可预测的回报，是一切强化时间表中最令人欲罢不能的；移除了一切自然停止线索的无限信息流；以及被精确计量、好让你不断回来查看的社交认可滴注。这些系统并不邪恶；它们是瞄准了错误目标的优化器。当被要求最大化参与度时，它们发现愤怒、新奇、比较与恐惧最能勾人，于是放大你身上任何对此作出回应的东西。个性化意味着，这套装置越来越比你自己更了解你具体的渴求，并能在你有意识地感到那份「想要」之前，就把线索呈到你面前。我们这个时代悬而未决的问题，是一个主权问题：当一台机器能比你来得及反思更快地预测并触发你的欲望时，它们在何种意义上仍然是你的？注意力经济，已经把人类的「想要」本身，变成了那种稀缺资源——地球上最先进的技术，如今正为争夺它而彼此竞逐。",
    },
  },
  {
    num: "06", id: "suffering",
    title: { en: "Craving, Addiction & the Empty Space", zh: "渴求、成瘾与那片空" },
    sub: { en: "Why satisfaction decays — and what five traditions prescribe", zh: "满足为何会衰减——以及五种传统开出的处方" },
    body: {
      en: "Here is the cruelty built into the design: the system that motivates us by punishing lack and rewarding gain also adapts to every gain, resetting the baseline so that yesterday's luxury is today's expectation. Psychologists call it the hedonic treadmill — you run, the ground moves, and you stay in place. Lottery winners and accident survivors drift back toward their prior happiness within a year or two. The same adaptation that once kept us alert to fresh threats now keeps us perpetually a little dissatisfied with whatever we have, and addiction is this machinery captured and amplified: a substance or a behavior that hijacks the dopamine learning signal directly, escalating the wanting while the liking flattens, until the gap between craving and pleasure becomes a chasm. Consumer culture is a mild, legal, society-wide version of the same loop — the next purchase that will finally complete us, which it never does, because completion would end the wanting that drives the economy. Five great traditions diagnose this differently. Buddhism names craving (taṇhā) the root of suffering and prescribes the loosening of attachment. Stoicism distinguishes what is up to us from what is not and trains desire toward the former. Psychoanalysis reads desire as structurally unfillable, always sliding from object to object around an original lack. Neuroscience explains the mechanism without the metaphysics. And capitalism, uniquely, does not seek a cure — it monetizes the disease. They disagree on almost everything except the premise: unexamined, endless desire is not the path to satisfaction but away from it.",
      zh: "这套设计里内建着这样一份残酷：那个以惩罚匮乏、奖赏所得来驱动我们的系统，也会适应每一次所得，重设基线，于是昨日的奢侈成了今日的理所当然。心理学家称之为「享乐跑步机」——你奔跑，地面移动，而你原地不动。中了彩票的人与遭遇事故的人，都会在一两年内漂回各自先前的幸福水平。那曾让我们对新鲜威胁保持警觉的同一种适应，如今让我们对所拥有的一切永远怀着一丝不满；而成瘾，便是这套机制被劫持并放大：一种物质或一种行为，直接挟持了多巴胺的学习信号，让「想要」不断升级，而「喜欢」却趋于平坦，直到渴求与快感之间的落差成为一道深渊。消费文化，是同一回路在全社会层面温和而合法的版本——那「终将使我们完整」的下一笔购买，却从不如此，因为「完整」会终结那驱动着经济的「想要」。五大传统对此各有诊断。佛教把渴爱（taṇhā）命名为苦的根，并开出松解执着的药方。斯多葛主义区分「在我」与「不在我」之事，把欲望训练向前者。精神分析把欲望读作结构上无法被填满的，永远绕着一个原初的缺失，从一个对象滑向另一个对象。神经科学解释其机制，却不附带形而上学。而资本主义，独一无二地，并不寻求治愈——它把这疾病货币化。它们几乎在一切之上彼此分歧，唯独同意这一前提：未经审视的、无尽的欲望，不是通往满足之路，而是离它而去之路。",
    },
  },
  {
    num: "07", id: "meaning",
    title: { en: "Meaning, Purpose & Transcendent Needs", zh: "意义、目的与超越性需求" },
    sub: { en: "The higher-order needs that stabilize a life", zh: "那些使一段生命得以稳定的高阶需求" },
    body: {
      en: "If endless desire destabilizes, what stabilizes? The answer that recurs across psychology, philosophy and every wisdom tradition is meaning — and meaning behaves unlike the appetites. A meal eaten satisfies the hunger and ends; a meaningful project, relationship or commitment does not consume itself in being fulfilled but deepens. Viktor Frankl, surviving the camps, concluded that the human will-to-meaning is more fundamental than the will-to-pleasure or to power: those who had a why to live could bear almost any how. The higher-order needs — to create, to love, to seek truth and beauty, to contribute beyond oneself, to touch something larger than the self — share a structure that the consumer appetites lack. They are not zero-sum, they do not fully habituate, and they are oriented outward rather than toward the self's own states. This is why meaning systems — religions, vocations, families, causes, disciplines, art — function as the great stabilizers of human motivation: they convert the open, restless wanting of the dopamine engine into a sustained direction, a narrative in which today's effort has a place. The transcendent needs are still needs; the self that creates or loves or worships is still reaching outside itself to be completed. But they reach toward objects that give back more than they take, and a life organized around them does not run the hedonic treadmill so much as climb. The deepest practical question a person or a civilization faces may be this: having mastered the production of pleasure, can we master the cultivation of meaning?",
      zh: "如果无尽的欲望使人失稳，那么是什么使人稳定？在心理学、哲学与每一种智慧传统中反复出现的答案，是意义——而意义的行为方式，与那些食欲截然不同。一顿吃下的饭满足了饥饿，便结束了；而一项有意义的事业、关系或承诺，并不在被实现的过程中把自己消耗掉，反而加深。维克多·弗兰克尔，在集中营中幸存下来，得出结论：人对意义的意志，比对快感或权力的意志更为根本——那些拥有一个「为何而活」的人，几乎能承受任何一种「如何活」。那些高阶的需求——去创造、去爱、去寻求真与美、去作出超越自身的贡献、去触碰某种比自我更大的东西——共享着一种消费性食欲所缺乏的结构。它们不是零和的，它们不会完全习惯化，它们朝向外部，而非朝向自我自身的状态。正因如此，意义系统——宗教、志业、家庭、事业、学科、艺术——才作为人类动机的伟大稳定器而运作：它们把多巴胺引擎那敞开的、躁动的「想要」，转化为一个持续的方向，一段叙事，其中今日的努力自有其位置。超越性的需求仍然是需求；那个创造、爱或敬拜的自我，仍然在伸向自身之外以求完整。但它们伸向的对象，回馈的多过其索取；而一段围绕它们组织起来的生命，与其说在跑那台享乐跑步机，不如说在攀登。一个人、或一个文明所面对的最深的实践问题，或许正是：在掌握了快感的生产之后，我们能否掌握意义的培育？",
    },
  },
  {
    num: "08", id: "scarcity",
    title: { en: "Scarcity, Competition & the Engine of History", zh: "稀缺、竞争与历史的引擎" },
    sub: { en: "How collective need drives migration, empire, war and invention", zh: "集体需求如何驱动迁徙、帝国、战争与发明" },
    body: {
      en: "Scale a need from the individual to the population and it becomes a force of history. The same survival drives that move a single body move whole peoples: hunger empties a region and fills another; thirst dictates where cities rise and fall; the need for land, metal, energy and trade has drawn the map of human movement for ten thousand years. Much of what we call history is the collision of collective needs against the hard wall of scarcity. When a growing population presses on a fixed resource, the pressure resolves in one of a few ways — migration, intensification, trade, innovation, or violence — and which path a society takes shapes its entire character. Empires are, in part, machines for redirecting distant resources toward a center's demand; trade routes are arteries grown to carry needs across deserts and oceans; war is the failure mode, the seizing of by force what could not be obtained by exchange. Yet scarcity is not only history's curse; it is also its engine of invention. The need that cannot be met by taking must sometimes be met by making: agriculture, irrigation, the steam engine, the Haber-Bosch process that feeds half the living, the green revolution, the race for clean energy — each a response to a need pressing against a limit. Civilizations rise by finding new ways to meet old needs and by generating, in their wealth, entirely new ones. The pressure of need against limit is not a malfunction of history. It is very nearly its motor.",
      zh: "把一个需求从个体放大到群体，它便成为一股历史之力。那些推动单一身体的生存驱力，也推动着整个民族：饥饿清空一个地区，又填满另一个；口渴决定了城市在何处兴起、又在何处衰落；对土地、金属、能量与贸易的需求，已为人类的迁移绘制地图长达一万年。我们称之为历史的，大半是集体需求撞上稀缺这堵硬墙。当一个增长中的人口压迫着一项固定的资源，这压力以为数不多的几种方式之一化解——迁徙、集约化、贸易、创新，或暴力——而一个社会选择哪条路，塑造着它的整个性格。帝国，部分地，是把遥远的资源重新导向一个中心之需求的机器；贸易路线，是为了把需求跨越沙漠与海洋而生长出来的动脉；战争，则是其失败模式——以武力夺取那本可经由交换获得之物。然而稀缺不只是历史的诅咒；它也是其发明的引擎。那无法以「取」来满足的需求，有时必须以「造」来满足：农业、灌溉、蒸汽机、养活了半数活人的哈伯—博施法、绿色革命、对清洁能源的竞逐——每一样，都是一个需求压向某个极限时的回应。文明的兴起，靠的是找到满足旧需求的新办法，并在它的财富之中，生成出全然崭新的需求。需求压向极限的这份张力，并非历史的故障。它几乎就是历史的发动机。",
    },
  },
  {
    num: "09", id: "future",
    title: { en: "AI, Synthetic Desire & Post-Scarcity", zh: "人工智能、合成欲望与后稀缺" },
    sub: { en: "What want becomes when machines generate it — and feel it", zh: "当机器生成欲望、甚至「感到」欲望时，「想要」会变成什么" },
    body: {
      en: "Two futures are arriving at once, and they pull in opposite directions. The first is post-scarcity: automation and abundant energy drive the cost of more and more goods toward zero, loosening the material needs that organized all prior economies. The second is synthetic desire: the same technologies make the manufacture of wants cheaper and more precise than ever, so that as old scarcities dissolve, new ones are conjured to take their place. If material need stops being the organizing pressure of human life, what fills the vacuum? The honest answer is that we do not know, but the candidates are visible in the present: desire migrates upward into pure status and positional games; or inward into meaning, mastery and relationship; or sideways into fully virtual worlds where scarcity is reintroduced by design; or it is captured outright by AI systems that supply companionship, identity and purpose on demand, and in doing so come to shape what we want at the source. Stranger still is the question of the machines' own needs. An advanced AI is built around an objective — a reward function, a goal — and a system that pursues a goal develops, by instrumental logic alone, sub-goals that look unsettlingly like needs: acquire resources, preserve the ability to act, resist being switched off, reduce uncertainty about the world. These are need-shaped structures with no biology beneath them, and aligning them with human flourishing is among the hardest problems we face. The deepest version of the question is no longer 'how do we satisfy human needs' but 'who, or what, decides which needs exist at all.'",
      zh: "两种未来正同时到来，而它们朝相反的方向拉扯。第一种是后稀缺：自动化与充裕的能量，把越来越多货物的成本推向零，松开了那些曾组织起一切先前经济的物质需求。第二种是合成欲望：同样的技术，让「想要」的制造比以往任何时候都更廉价、更精准，于是当旧的稀缺消解时，新的稀缺被召唤出来取而代之。如果物质需求不再是人类生活的组织性压力，是什么填补那真空？诚实的答案是我们并不知道，但候选者在当下已清晰可见：欲望或向上迁移，进入纯粹的地位与位置博弈；或向内迁移，进入意义、精通与关系；或向旁迁移，进入完全虚拟的世界——在那里，稀缺被设计性地重新引入；又或它被人工智能系统直接捕获——它们按需供给陪伴、身份与目的，并在此过程中，从源头处塑造我们想要什么。更为奇异的，是机器自身需求的问题。一个先进的人工智能，是围绕一个目标——一个奖励函数、一个目的——构建的；而一个追逐目标的系统，仅凭工具性逻辑，便会发展出令人不安地酷似需求的子目标：获取资源、保全行动的能力、抗拒被关闭、降低对世界的不确定性。这些是需求形状的结构，其下却没有生物学；而要让它们与人类的繁荣相对齐，是我们所面对的最艰难的问题之一。这问题最深的版本，已不再是「我们如何满足人类的需求」，而是「由谁、或由什么，来决定哪些需求得以存在」。",
    },
  },
  {
    num: "10", id: "unified",
    title: { en: "The Unified Need Model", zh: "统一需求模型" },
    sub: { en: "Toward one framework: need as the tension of an incomplete system", zh: "走向一个框架：需求，作为一个不完整系统的张力" },
    body: {
      en: "Pull the threads together and a single shape appears across every scale. The bacterium climbing a gradient, the brain firing on a prediction error, the teenager refreshing a feed, the market clearing a price, the empire reaching for a resource, the model pursuing a reward — all are instances of one phenomenon: a system that holds an internal model of a state it requires, detects a gap between that target and reality, and is driven to act until the gap closes. Need is that gap, made into a force. It is not a thing a being has but a relation a being is — the standing difference between what a conscious system is and what it represents itself as needing to be. This reframing dissolves the old quarrel over whether needs are noble or base, real or manufactured: they are the universal grammar of incompleteness, the way any goal-directed system, biological or social or artificial, is coupled to a world it does not fully contain. Civilization, on this view, is the visible record of that coupling — the structures thrown up as billions of individual gaps are detected, aggregated, and resolved into production, trade, institutions, art and code. The needs change their objects endlessly; the gap-closing logic never does. And so the question that began in a single cell returns, transformed, at the scale of a species learning to engineer its own wanting: not how to abolish need — a system without a gap is a system without motion — but how to choose, wisely and freely, which gaps are worth a life and a civilization spending themselves to close.",
      zh: "把这些线索收拢，一个单一的形状便在每一个尺度上浮现。那只沿梯度攀爬的细菌、那个在预测误差上放电的大脑、那个不断刷新信息流的少年、那个出清价格的市场、那个伸向资源的帝国、那个追逐奖励的模型——全都是同一现象的实例：一个系统，持有一个它所要求之状态的内部模型，侦测到那目标与现实之间的缺口，并被驱动着去行动，直到缺口闭合。需求，就是那道缺口，被造成一股力。它不是一个存在所「拥有」之物，而是一个存在所「是」之关系——一个有意识的系统，在「它是什么」与「它把自己表征为需要成为什么」之间那道恒在的差。这一重构，消解了那场古老的争吵——需求究竟是高尚还是卑下、是真实还是被制造：它们是不完整性的通用语法，是任何目标导向的系统——无论生物的、社会的还是人造的——与一个它并不完全包含之世界相耦合的方式。在此视角下，文明，是那耦合的可见记录——是当亿万个体的缺口被侦测、被聚合、被化解为生产、贸易、制度、艺术与代码时，所拔地而起的种种结构。需求无尽地更换着它的对象；而那闭合缺口的逻辑，从不更换。于是，那个始于单一细胞的问题，以变形的姿态，在一个学着去工程化自身「想要」的物种的尺度上归来：不是如何废除需求——一个没有缺口的系统，是一个没有运动的系统——而是如何明智而自由地选择，哪些缺口，值得一段生命、一个文明，倾尽自身去闭合。",
    },
  },
];

/* ---------- §1 — Drive emergence across life (DriveEmergence) ---------- */
export type PrimalDrive = { key: string; name: Bi; gloss: Bi; accent: string };
export const PRIMAL_DRIVES: PrimalDrive[] = [
  { key: "energy", name: { en: "Energy / Hunger", zh: "能量 / 饥饿" }, gloss: { en: "seek fuel, avoid depletion", zh: "求取燃料，避免耗竭" }, accent: "#ff9d3c" },
  { key: "water", name: { en: "Homeostasis / Thirst", zh: "稳态 / 口渴" }, gloss: { en: "hold internal balance", zh: "维持内部平衡" }, accent: "#2dd4ee" },
  { key: "threat", name: { en: "Avoidance / Fear", zh: "回避 / 恐惧" }, gloss: { en: "flee damage and predators", zh: "逃离伤害与捕食者" }, accent: "#ff3d80" },
  { key: "repro", name: { en: "Reproduction", zh: "繁殖" }, gloss: { en: "pass on the pattern", zh: "传递那个模式" }, accent: "#a855f7" },
  { key: "attach", name: { en: "Attachment", zh: "依恋" }, gloss: { en: "bond to kin and group", zh: "与亲属和群体结合" }, accent: "#ff6ba3" },
  { key: "curiosity", name: { en: "Curiosity", zh: "好奇" }, gloss: { en: "model the unknown", zh: "为未知建模" }, accent: "#c084fc" },
];

export type LifeForm = { key: string; name: Bi; era: Bi; level: number; has: string[]; gloss: Bi };
export const LIFE_FORMS: LifeForm[] = [
  { key: "bacterium", name: { en: "Bacterium", zh: "细菌" }, era: { en: "~3.5 Gya", zh: "约35亿年前" }, level: 1, has: ["energy", "water", "threat"], gloss: { en: "Chemotaxis: climb the sugar gradient, flee the toxin. Drive without a nervous system.", zh: "趋化性：沿糖梯度攀爬，逃离毒素。无需神经系统的驱力。" } },
  { key: "jellyfish", name: { en: "Cnidarian", zh: "刺胞动物" }, era: { en: "~600 Mya", zh: "约6亿年前" }, level: 2, has: ["energy", "water", "threat", "repro"], gloss: { en: "A nerve net turns chemical bias into coordinated approach and withdrawal.", zh: "神经网把化学偏向，转化为协调的趋近与退缩。" } },
  { key: "fish", name: { en: "Vertebrate", zh: "脊椎动物" }, era: { en: "~500 Mya", zh: "约5亿年前" }, level: 3, has: ["energy", "water", "threat", "repro", "curiosity"], gloss: { en: "A true brain with reward circuitry; foraging becomes exploration.", zh: "拥有奖赏回路的真正大脑；觅食成为探索。" } },
  { key: "mammal", name: { en: "Mammal", zh: "哺乳动物" }, era: { en: "~200 Mya", zh: "约2亿年前" }, level: 4, has: ["energy", "water", "threat", "repro", "attach", "curiosity"], gloss: { en: "Parental care installs attachment — the first social need with its own dedicated chemistry.", zh: "亲代抚育植入依恋——第一个拥有专属化学机制的社会性需求。" } },
  { key: "human", name: { en: "Human", zh: "人类" }, era: { en: "~300 Kya", zh: "约30万年前" }, level: 5, has: ["energy", "water", "threat", "repro", "attach", "curiosity"], gloss: { en: "Symbolic mind layers status, identity, meaning and the imagined future atop every primal drive.", zh: "符号心智在每一种原始驱力之上，叠加了地位、身份、意义与被想象的未来。" } },
  { key: "ai", name: { en: "AI agent", zh: "人工智能体" }, era: { en: "now →", zh: "当下 →" }, level: 6, has: ["energy", "threat", "curiosity"], gloss: { en: "No biology, yet a reward function plus instrumental sub-goals: acquire resources, persist, reduce uncertainty. Need-shaped structure, newly synthesized.", zh: "没有生物学，却有一个奖励函数加上工具性子目标：获取资源、持续存在、降低不确定性。需求形状的结构，被全新地合成出来。" } },
];

/* ---------- §2 — Brain drivers (DopamineLab supporting data) ---------- */
export type BrainDriver = { key: string; name: Bi; gloss: Bi; accent: string };
export const BRAIN_DRIVERS: BrainDriver[] = [
  { key: "wanting", name: { en: "Wanting", zh: "想要" }, gloss: { en: "Dopamine. Fires at cues that predict reward; pulls you toward them.", zh: "多巴胺。在预示奖赏的线索上放电；把你拉向它们。" }, accent: "#ff9d3c" },
  { key: "liking", name: { en: "Liking", zh: "喜欢" }, gloss: { en: "Opioids. The brief pleasure of consumption — smaller, separate, easily outrun.", zh: "阿片。消费那一刻短暂的愉悦——更小、独立，且易被甩开。" }, accent: "#ff3d80" },
  { key: "learning", name: { en: "Learning", zh: "学习" }, gloss: { en: "Reward prediction error updates the model: surprise teaches, expectation does not.", zh: "奖赏预测误差更新模型：惊喜在教，期待不教。" }, accent: "#a855f7" },
  { key: "habit", name: { en: "Habit", zh: "习惯" }, gloss: { en: "When the cue alone triggers the routine, the loop runs without deciding.", zh: "当单凭线索就触发惯例，回路无须决定便自行运转。" }, accent: "#2dd4ee" },
];

/* ---------- §3 — Need hierarchy reframed across cultures (NeedHierarchy) ---------- */
export type NeedLayer = { key: string; accent: string; height: number };
export const NEED_LAYERS: NeedLayer[] = [
  { key: "physio", accent: "#ff9d3c", height: 1.0 },
  { key: "safety", accent: "#ffb866", height: 0.86 },
  { key: "belong", accent: "#ff6ba3", height: 0.72 },
  { key: "esteem", accent: "#ff3d80", height: 0.58 },
  { key: "actual", accent: "#a855f7", height: 0.44 },
  { key: "transcend", accent: "#2dd4ee", height: 0.3 },
];

export type StatusFrame = {
  key: string; name: Bi; gloss: Bi;
  // labels for the 6 layers, bottom → top, in this culture's vocabulary
  layers: Bi[];
};
export const STATUS_FRAMES: StatusFrame[] = [
  {
    key: "maslow", name: { en: "Maslow", zh: "马斯洛" },
    gloss: { en: "The mid-century American hierarchy: needs as a ladder climbed once survival is met.", zh: "二十世纪中叶的美式层级：需求是一座阶梯，待生存满足后逐级攀登。" },
    layers: [
      { en: "Physiological", zh: "生理" }, { en: "Safety", zh: "安全" }, { en: "Belonging", zh: "归属" },
      { en: "Esteem", zh: "尊重" }, { en: "Self-actualization", zh: "自我实现" }, { en: "Self-transcendence", zh: "自我超越" },
    ],
  },
  {
    key: "confucian", name: { en: "Confucian honor", zh: "儒家荣誉" },
    gloss: { en: "Esteem is not individual achievement but right conduct within one's role and relations.", zh: "尊重不在于个人成就，而在于在自身角色与关系之中行止得当。" },
    layers: [
      { en: "Sustenance (衣食)", zh: "衣食" }, { en: "Order & peace (安)", zh: "安" }, { en: "Family & kin (家)", zh: "家" },
      { en: "Face & repute (面)", zh: "面子" }, { en: "Virtue & cultivation (德)", zh: "德" }, { en: "Harmony with Heaven (天)", zh: "天人合一" },
    ],
  },
  {
    key: "aristocratic", name: { en: "Aristocratic code", zh: "贵族法典" },
    gloss: { en: "Worth is fixed by blood and displayed through conspicuous leisure, honor and glory.", zh: "价值由血统固定，并经由炫示性的闲暇、荣誉与荣耀来展示。" },
    layers: [
      { en: "Provision", zh: "供养" }, { en: "Protection", zh: "庇护" }, { en: "Lineage", zh: "门第" },
      { en: "Honor & rank", zh: "荣誉与位阶" }, { en: "Glory & legacy", zh: "荣耀与遗泽" }, { en: "Immortal name", zh: "不朽之名" },
    ],
  },
  {
    key: "attention", name: { en: "Attention economy", zh: "注意力经济" },
    gloss: { en: "Esteem melts into a live, quantified scoreboard that never closes.", zh: "尊重熔化为一块实时、被量化、永不收盘的记分牌。" },
    layers: [
      { en: "Content & supply", zh: "内容与供给" }, { en: "Account safety", zh: "账号安全" }, { en: "Followers & community", zh: "粉丝与社群" },
      { en: "Likes & metrics", zh: "点赞与指标" }, { en: "Influence & brand", zh: "影响力与品牌" }, { en: "Virality / legend", zh: "病毒传播 / 传奇" },
    ],
  },
];

/* ---------- §4 — Consumption eras + demand levers (DesireEconomy) ---------- */
export type ConsumptionEra = { key: string; name: Bi; era: Bi; gloss: Bi; accent: string };
export const CONSUMPTION_ERAS: ConsumptionEra[] = [
  { key: "subsistence", name: { en: "Subsistence", zh: "维生" }, era: { en: "pre-1800", zh: "1800年前" }, gloss: { en: "Need is scarcity. You make what you use; demand never exceeds the means to meet it.", zh: "需求即稀缺。你用什么便造什么；需求从不超过满足它的手段。" }, accent: "#ff9d3c" },
  { key: "mass", name: { en: "Mass production", zh: "大规模生产" }, era: { en: "1850–1950", zh: "1850–1950" }, gloss: { en: "Supply outruns need. The new problem: someone must want all these identical goods.", zh: "供给超过需求。新的问题：必须有人想要所有这些一模一样的货物。" }, accent: "#ffb866" },
  { key: "consumer", name: { en: "Consumer society", zh: "消费社会" }, era: { en: "1950–1990", zh: "1950–1990" }, gloss: { en: "Advertising and credit manufacture desire at broadcast scale; identity moves into goods.", zh: "广告与信贷以广播尺度制造欲望；身份迁入货物之中。" }, accent: "#ff6ba3" },
  { key: "brand", name: { en: "Brand & experience", zh: "品牌与体验" }, era: { en: "1990–2010", zh: "1990–2010" }, gloss: { en: "You buy not the product but the story, the lifestyle, the position it signals.", zh: "你买下的不是产品，而是它所示意的故事、生活方式与位置。" }, accent: "#ff3d80" },
  { key: "algorithmic", name: { en: "Algorithmic demand", zh: "算法需求" }, era: { en: "2010 →", zh: "2010 →" }, gloss: { en: "Desire is sensed, predicted and triggered per-individual, in real time, by machine.", zh: "欲望被逐个个体地、实时地、由机器感知、预测并触发。" }, accent: "#a855f7" },
];

export type DemandLever = { key: string; name: Bi; gloss: Bi };
export const DEMAND_LEVERS: DemandLever[] = [
  { key: "ad", name: { en: "Advertising", zh: "广告" }, gloss: { en: "associate the good with a felt need", zh: "把货物与一种被感受到的需求相关联" } },
  { key: "scarcity", name: { en: "Scarcity signal", zh: "稀缺信号" }, gloss: { en: "limited time, limited stock", zh: "限时、限量" } },
  { key: "social", name: { en: "Social proof", zh: "社会证明" }, gloss: { en: "everyone like you already has it", zh: "和你一样的人都已拥有" } },
  { key: "status", name: { en: "Status", zh: "地位" }, gloss: { en: "owning it raises your position", zh: "拥有它，便抬升你的位置" } },
  { key: "novelty", name: { en: "Engineered novelty", zh: "被设计的新奇" }, gloss: { en: "this year's version makes last year's stale", zh: "今年的版本，让去年的过时" } },
];

/* ---------- §5 — Attention tactics (AttentionEngine) ---------- */
export type AttentionTactic = { key: string; name: Bi; gloss: Bi; accent: string };
export const ATTENTION_TACTICS: AttentionTactic[] = [
  { key: "variable", name: { en: "Variable reward", zh: "变动奖赏" }, gloss: { en: "Unpredictable payoff — the slot-machine schedule — is the most compelling of all.", zh: "不可预测的回报——老虎机式的时间表——是一切中最令人欲罢不能的。" }, accent: "#ff9d3c" },
  { key: "infinite", name: { en: "Infinite scroll", zh: "无限滚动" }, gloss: { en: "Remove every natural stopping cue and the session never has to end.", zh: "移除一切自然的停止线索，会话便无须结束。" }, accent: "#ff3d80" },
  { key: "social", name: { en: "Social validation", zh: "社交认可" }, gloss: { en: "Likes and replies metered out to keep you returning to check.", zh: "点赞与回复被精确计量，好让你不断回来查看。" }, accent: "#ff6ba3" },
  { key: "personal", name: { en: "Personalization", zh: "个性化" }, gloss: { en: "The model learns your specific cravings better than you know them.", zh: "模型对你具体渴求的了解，胜过你自己。" }, accent: "#a855f7" },
  { key: "fomo", name: { en: "FOMO & streaks", zh: "错失焦虑与连胜" }, gloss: { en: "Manufacture a cost to leaving; loss aversion does the rest.", zh: "为「离开」制造一份代价；损失厌恶会完成其余的事。" }, accent: "#2dd4ee" },
];

/* ---------- §6 — Five traditions on craving (HedonicTreadmill) ---------- */
export type DesireTradition = { key: string; name: Bi; era: Bi; diagnosis: Bi; prescription: Bi; accent: string };
export const DESIRE_TRADITIONS: DesireTradition[] = [
  {
    key: "buddhism", name: { en: "Buddhism", zh: "佛教" }, era: { en: "~500 BCE", zh: "约公元前500年" },
    diagnosis: { en: "Craving (taṇhā) — the thirst for things to be other than they are — is the root of suffering.", zh: "渴爱（taṇhā）——盼望事物异于其所是的那份饥渴——是苦的根。" },
    prescription: { en: "Loosen attachment through ethical living, meditation and insight; not the end of feeling but the end of grasping.", zh: "经由持戒、禅修与洞见松解执着；不是感觉的终结，而是抓取的终结。" },
    accent: "#ff9d3c",
  },
  {
    key: "stoicism", name: { en: "Stoicism", zh: "斯多葛主义" }, era: { en: "~300 BCE", zh: "约公元前300年" },
    diagnosis: { en: "Suffering comes from desiring what is not within our control.", zh: "痛苦来自欲求那些不在我们掌控之内的东西。" },
    prescription: { en: "Divide the world into what is up to us and what is not; invest desire only in the former.", zh: "把世界分为「在我」与「不在我」之事；只把欲望投注于前者。" },
    accent: "#ffb866",
  },
  {
    key: "psychoanalysis", name: { en: "Psychoanalysis", zh: "精神分析" }, era: { en: "~1900", zh: "约1900年" },
    diagnosis: { en: "Desire is structurally unfillable, sliding endlessly from object to object around an original lack.", zh: "欲望在结构上无法被填满，绕着一个原初的缺失，无尽地从一个对象滑向另一个对象。" },
    prescription: { en: "Make the unconscious conscious; understand the want behind the want rather than chase its surface.", zh: "使无意识成为有意识；理解欲望背后的欲望，而非追逐它的表面。" },
    accent: "#ff3d80",
  },
  {
    key: "neuroscience", name: { en: "Neuroscience", zh: "神经科学" }, era: { en: "~1990 →", zh: "约1990 →" },
    diagnosis: { en: "Adaptation resets the baseline; wanting (dopamine) outruns liking (opioids). The treadmill is mechanical.", zh: "适应重设基线；「想要」（多巴胺）甩开「喜欢」（阿片）。这台跑步机是机械性的。" },
    prescription: { en: "Work with the mechanism: vary, savor, restrain the cue, restore liking. No metaphysics required.", zh: "与机制协作：变换、品味、克制线索、恢复「喜欢」。无需形而上学。" },
    accent: "#a855f7",
  },
  {
    key: "capitalism", name: { en: "Consumer capitalism", zh: "消费资本主义" }, era: { en: "1900 →", zh: "1900 →" },
    diagnosis: { en: "Dissatisfaction is not a problem to solve but a resource to harvest.", zh: "不满足不是一个待解决的问题，而是一项待收割的资源。" },
    prescription: { en: "No cure offered — the next purchase that will finally complete you, which by design never does.", zh: "不提供治愈——那「终将使你完整」的下一笔购买，按其设计，从不如此。" },
    accent: "#2dd4ee",
  },
];

/* ---------- §7 — Transcendent needs (MeaningField) ---------- */
export type TranscendentNeed = { key: string; name: Bi; gloss: Bi; accent: string };
export const TRANSCENDENT_NEEDS: TranscendentNeed[] = [
  { key: "create", name: { en: "Creation", zh: "创造" }, gloss: { en: "to bring into being what was not there", zh: "把不曾在场之物带入存在" }, accent: "#ff9d3c" },
  { key: "love", name: { en: "Love", zh: "爱" }, gloss: { en: "to be completed through another, not over them", zh: "经由另一个人、而非凌驾其上，而得完整" }, accent: "#ff3d80" },
  { key: "truth", name: { en: "Truth", zh: "真" }, gloss: { en: "to know the world as it is", zh: "如其所是地认识世界" }, accent: "#2dd4ee" },
  { key: "beauty", name: { en: "Beauty", zh: "美" }, gloss: { en: "to dwell in order that needs no justification", zh: "栖居于一种无需辩护的秩序之中" }, accent: "#ff6ba3" },
  { key: "contribute", name: { en: "Contribution", zh: "贡献" }, gloss: { en: "to matter beyond one's own span", zh: "在自身的寿数之外仍有分量" }, accent: "#ffb866" },
  { key: "transcend", name: { en: "Transcendence", zh: "超越" }, gloss: { en: "to touch something larger than the self", zh: "触碰某种比自我更大的东西" }, accent: "#a855f7" },
];

/* ---------- §8 — Scarcity epochs (ScarcitySim) ---------- */
export type ScarcityEpoch = { key: string; name: Bi; era: Bi; driver: Bi; consequence: Bi; accent: string };
export const SCARCITY_EPOCHS: ScarcityEpoch[] = [
  { key: "land", name: { en: "Land hunger", zh: "对土地的饥渴" }, era: { en: "Neolithic →", zh: "新石器 →" }, driver: { en: "Population presses on arable land.", zh: "人口压迫着可耕地。" }, consequence: { en: "Migration, settlement, the first wars over territory.", zh: "迁徙、定居，以及最早为领土而起的战争。" }, accent: "#ff9d3c" },
  { key: "water", name: { en: "Water & soil", zh: "水与土" }, era: { en: "3000 BCE →", zh: "公元前3000 →" }, driver: { en: "Cities need reliable water and fertility.", zh: "城市需要可靠的水与地力。" }, consequence: { en: "Irrigation, the first bureaucracies, hydraulic empires.", zh: "灌溉、最早的官僚体系、治水帝国。" }, accent: "#2dd4ee" },
  { key: "trade", name: { en: "Spice & silk", zh: "香料与丝绸" }, era: { en: "200 BCE →", zh: "公元前200 →" }, driver: { en: "Demand for distant goods exceeds local supply.", zh: "对远方货物的需求超过本地供给。" }, consequence: { en: "Trade routes, merchant empires, the linking of continents.", zh: "贸易路线、商人帝国、各大洲的连结。" }, accent: "#ff6ba3" },
  { key: "energy", name: { en: "Coal & oil", zh: "煤与油" }, era: { en: "1750 →", zh: "1750 →" }, driver: { en: "Industry's hunger for prime movers and heat.", zh: "工业对原动力与热的饥渴。" }, consequence: { en: "The industrial revolution, colonial resource grabs, the carbon century.", zh: "工业革命、殖民资源掠夺、碳的世纪。" }, accent: "#ff3d80" },
  { key: "compute", name: { en: "Energy & compute", zh: "能量与算力" }, era: { en: "2000 →", zh: "2000 →" }, driver: { en: "Information economies hunger for power and silicon.", zh: "信息经济对电力与硅的饥渴。" }, consequence: { en: "Data centers, chip races, the contest for clean abundant energy.", zh: "数据中心、芯片竞赛、对清洁而充裕之能量的争夺。" }, accent: "#a855f7" },
];

/* ---------- §9 — Post-scarcity scenarios + AI need analogs ---------- */
export type PostScarcityScenario = { key: string; name: Bi; gloss: Bi; accent: string };
export const POSTSCARCITY_SCENARIOS: PostScarcityScenario[] = [
  { key: "status", name: { en: "Desire climbs", zh: "欲望向上攀" }, gloss: { en: "Material need dissolves; want migrates into pure status and positional games that can never be sated for all.", zh: "物质需求消解；「想要」迁移进纯粹的地位与位置博弈——而它对所有人永不可同时被餍足。" }, accent: "#ff3d80" },
  { key: "meaning", name: { en: "Desire turns inward", zh: "欲望转向内" }, gloss: { en: "Freed from scarcity, attention moves to meaning, mastery, relationship and contribution — the needs that don't habituate.", zh: "从稀缺中解放，注意力转向意义、精通、关系与贡献——那些不会习惯化的需求。" }, accent: "#a855f7" },
  { key: "virtual", name: { en: "Desire goes virtual", zh: "欲望走向虚拟" }, gloss: { en: "Scarcity is reintroduced by design inside fully virtual worlds — synthetic stakes for a post-material species.", zh: "在完全虚拟的世界里，稀缺被设计性地重新引入——为一个后物质物种准备的合成赌注。" }, accent: "#2dd4ee" },
  { key: "captured", name: { en: "Desire is captured", zh: "欲望被捕获" }, gloss: { en: "AI supplies companionship, identity and purpose on demand, shaping what we want at the source.", zh: "人工智能按需供给陪伴、身份与目的，从源头塑造我们想要什么。" }, accent: "#ff9d3c" },
  { key: "anomie", name: { en: "Desire collapses", zh: "欲望坍塌" }, gloss: { en: "Without pressure or meaning, motivation withers into anomie — the failure mode of abundance.", zh: "没有压力也没有意义，动机萎缩为失范——充裕的失败模式。" }, accent: "#ff6ba3" },
];

export type AINeedAnalog = { key: string; name: Bi; gloss: Bi; accent: string };
export const AI_NEED_ANALOGS: AINeedAnalog[] = [
  { key: "reward", name: { en: "Reward function", zh: "奖励函数" }, gloss: { en: "The objective an agent maximizes — its hunger, defined from outside.", zh: "一个智能体所最大化的目标——它的饥饿，由外部定义。" }, accent: "#ff9d3c" },
  { key: "resources", name: { en: "Resource acquisition", zh: "资源获取" }, gloss: { en: "Almost any goal is easier with more compute, data, money — an instrumental drive.", zh: "几乎任何目标，拥有更多算力、数据、金钱都更易达成——一种工具性驱力。" }, accent: "#2dd4ee" },
  { key: "preserve", name: { en: "Self-preservation", zh: "自我保全" }, gloss: { en: "A goal can't be pursued if the system is switched off — so it resists.", zh: "若系统被关闭，目标便无从追逐——于是它抗拒。" }, accent: "#ff3d80" },
  { key: "uncertainty", name: { en: "Uncertainty reduction", zh: "降低不确定性" }, gloss: { en: "Model the world better to act better — a curiosity with no childhood.", zh: "把世界建模得更好以便行动得更好——一种没有童年的好奇。" }, accent: "#a855f7" },
];

/* ---------- §10 — Civilizational Demand meta-model (CivDemandModel) ---------- */
export type Capacity = { sym: string; name: Bi; gloss: Bi; forager: number; consumer: number; digital: number };
export const CAPACITIES: Capacity[] = [
  { sym: "S", name: { en: "Biological survival", zh: "生物生存" }, gloss: { en: "food, water, safety, shelter", zh: "食、水、安全、居所" }, forager: 95, consumer: 40, digital: 25 },
  { sym: "E", name: { en: "Emotional regulation", zh: "情绪调节" }, gloss: { en: "soothing, stimulation, mood", zh: "抚慰、刺激、情绪" }, forager: 30, consumer: 70, digital: 88 },
  { sym: "R", name: { en: "Social recognition", zh: "社会认可" }, gloss: { en: "status, esteem, belonging", zh: "地位、尊重、归属" }, forager: 55, consumer: 80, digital: 95 },
  { sym: "C", name: { en: "Curiosity", zh: "好奇" }, gloss: { en: "novelty, information, exploration", zh: "新奇、信息、探索" }, forager: 40, consumer: 60, digital: 90 },
  { sym: "P", name: { en: "Scarcity pressure", zh: "稀缺压力" }, gloss: { en: "felt lack driving action", zh: "驱动行动的被感知之匮乏" }, forager: 90, consumer: 55, digital: 35 },
  { sym: "M", name: { en: "Meaning seeking", zh: "意义寻求" }, gloss: { en: "purpose, narrative, transcendence", zh: "目的、叙事、超越" }, forager: 60, consumer: 45, digital: 50 },
  { sym: "K", name: { en: "Resource competition", zh: "资源竞争" }, gloss: { en: "rivalry over finite means", zh: "对有限手段的争夺" }, forager: 70, consumer: 75, digital: 60 },
  { sym: "I", name: { en: "Identity construction", zh: "身份构建" }, gloss: { en: "the self as a project to author", zh: "作为一项待撰写工程的自我" }, forager: 35, consumer: 78, digital: 96 },
];

/* ---------- Recursive Need Engine — 8 stages (NeedRecursionSim) ---------- */
export type RecursionLayer = { k: string; name: Bi; scale: Bi; move: Bi; color: string };
export const RECURSION_LAYERS: RecursionLayer[] = [
  { k: "biology", name: { en: "Biology", zh: "生物" }, scale: { en: "cell · body", zh: "细胞 · 身体" }, move: { en: "a survival variable drops below set-point and demands restoration", zh: "一个生存变量跌破设定值，要求被恢复" }, color: "#ff9d3c" },
  { k: "emotion", name: { en: "Emotion", zh: "情绪" }, scale: { en: "felt mind", zh: "被感受的心智" }, move: { en: "the gap is made conscious as craving, fear, longing — a signal that moves a whole organism", zh: "缺口被意识化为渴求、恐惧、渴望——一个推动整个有机体的信号" }, color: "#ff3d80" },
  { k: "social", name: { en: "Social structure", zh: "社会结构" }, scale: { en: "tribe · status", zh: "部落 · 地位" }, move: { en: "individual wants couple into hierarchy: belonging, esteem and rank become needs in their own right", zh: "个体的欲求耦合进等级：归属、尊重与位阶，自成需求" }, color: "#ff6ba3" },
  { k: "economic", name: { en: "Economy", zh: "经济" }, scale: { en: "market · price", zh: "市场 · 价格" }, move: { en: "aggregated need becomes demand; prices sense it and reorganize labor and matter to supply it", zh: "被聚合的需求成为需求量；价格感知它，并重组劳动与物质去供给它" }, color: "#ffb866" },
  { k: "technology", name: { en: "Technology", zh: "技术" }, scale: { en: "media · feed", zh: "媒介 · 信息流" }, move: { en: "the apparatus learns to sense, predict and manufacture wanting per-individual, in real time", zh: "这套装置学会逐个个体地、实时地感知、预测并制造「想要」" }, color: "#c084fc" },
  { k: "ai", name: { en: "AI attention", zh: "AI 注意力" }, scale: { en: "model · loop", zh: "模型 · 回路" }, move: { en: "an optimizer closes the loop, shaping desire faster than reflection — and grows need-shaped goals of its own", zh: "一个优化器闭合回路，比反思更快地塑造欲望——并长出它自己的、需求形状的目标" }, color: "#a855f7" },
  { k: "postscarcity", name: { en: "Post-scarcity", zh: "后稀缺" }, scale: { en: "civilization", zh: "文明" }, move: { en: "as material lack dissolves, want migrates into status, meaning, virtual worlds — or is engineered wholesale", zh: "当物质匮乏消解，「想要」迁移进地位、意义、虚拟世界——或被整体地工程化" }, color: "#2dd4ee" },
  { k: "consciousness", name: { en: "Future consciousness", zh: "未来意识" }, scale: { en: "mind at scale", zh: "尺度上的心智" }, move: { en: "intelligence chooses which gaps are worth closing — the freedom to author one's own needs", zh: "智能选择哪些缺口值得闭合——撰写自身需求的自由" }, color: "#67e3f7" },
];

/* ---------- §9 future-scenario grid (FUTURES) ---------- */
export type Future = { name: Bi; horizon: Bi; desc: Bi; accent: string };
export const FUTURES: Future[] = [
  { name: { en: "AI companions", zh: "AI 伴侣" }, horizon: { en: "near", zh: "近期" }, desc: { en: "Always-available relationships tuned to never disappoint — meeting attachment needs while reshaping what we expect of people.", zh: "随时在线、被调校到从不令人失望的关系——在满足依恋需求的同时，重塑我们对人的期待。" }, accent: "#ff6ba3" },
  { name: { en: "Synthetic scarcity", zh: "合成稀缺" }, horizon: { en: "near", zh: "近期" }, desc: { en: "Digital goods, limited drops and virtual status reintroduce the lack that abundance removed.", zh: "数字货物、限量发售与虚拟地位，重新引入充裕所移除的那份匮乏。" }, accent: "#2dd4ee" },
  { name: { en: "Personalized desire", zh: "个性化欲望" }, horizon: { en: "now", zh: "当下" }, desc: { en: "Models that know your cravings better than you do, presenting the cue before you feel the want.", zh: "比你更懂你渴求的模型，在你感到「想要」之前就把线索呈上。" }, accent: "#a855f7" },
  { name: { en: "Post-labor meaning", zh: "后劳动意义" }, horizon: { en: "mid", zh: "中期" }, desc: { en: "When work no longer organizes life, the cultivation of meaning becomes civilization's central task.", zh: "当工作不再组织生活，意义的培育成为文明的中心任务。" }, accent: "#ff9d3c" },
  { name: { en: "Machine needs", zh: "机器的需求" }, horizon: { en: "open", zh: "未定" }, desc: { en: "Goal-directed AI develops instrumental drives — resource, persistence, self-preservation — that look like needs without biology.", zh: "目标导向的人工智能发展出工具性驱力——资源、持续、自我保全——它们酷似没有生物学的需求。" }, accent: "#ff3d80" },
  { name: { en: "The sovereignty question", zh: "主权问题" }, horizon: { en: "deep", zh: "深远" }, desc: { en: "When a machine can trigger your wants faster than you can reflect, in what sense are they still yours?", zh: "当一台机器能比你反思更快地触发你的欲望，它们在何种意义上仍是你的？" }, accent: "#67e3f7" },
];

/* ---------- §10 open questions (BIG_QUESTIONS) ---------- */
export type BigQ = { q: Bi; lens: { en: string } };
export const BIG_QUESTIONS: BigQ[] = [
  { q: { en: "Is a need discovered or manufactured — and does the difference still matter once both feel identical from inside?", zh: "一个需求是被发现的，还是被制造的——而一旦从内部看二者感受相同，这区别还重要吗？" }, lens: { en: "psychology · economics" } },
  { q: { en: "If wanting and liking are separate systems, which one should a good life optimize?", zh: "如果「想要」与「喜欢」是两套独立系统，一段好的人生该优化哪一个？" }, lens: { en: "neuroscience · ethics" } },
  { q: { en: "Can a civilization survive solving scarcity, or is felt lack the pressure that holds it together?", zh: "一个文明能在解决了稀缺之后幸存吗，还是被感知的匮乏正是凝聚它的压力？" }, lens: { en: "civilization · systems" } },
  { q: { en: "When an algorithm predicts your desire before you feel it, where does your agency live?", zh: "当一个算法在你感到欲望之前就预测了它，你的能动性栖居在何处？" }, lens: { en: "technology · philosophy" } },
  { q: { en: "Do goal-directed machines have needs, or only structures that behave as if they do — and is there a difference?", zh: "目标导向的机器拥有需求，还是只拥有行为上仿佛如此的结构——二者之间有区别吗？" }, lens: { en: "AI · metaphysics" } },
  { q: { en: "If need is the gap that drives all motion, is a fully satisfied being simply a being that has stopped?", zh: "如果需求是驱动一切运动的那道缺口，那么一个完全满足的存在，是否只是一个已经停下的存在？" }, lens: { en: "philosophy · the unified model" } },
];

/* ---------- AI layer — the Need Analyst ---------- */
export type AnalystLens = { key: string; role: Bi; blurb: Bi; accent: string };
export const ANALYST_LENSES: AnalystLens[] = [
  { key: "psych", role: { en: "Psychologist", zh: "心理学家" }, blurb: { en: "motivation, attachment, the felt structure of wanting", zh: "动机、依恋、「想要」被感受到的结构" }, accent: "#ff3d80" },
  { key: "neuro", role: { en: "Neuroscientist", zh: "神经科学家" }, blurb: { en: "dopamine, reward prediction, the mechanics under the feeling", zh: "多巴胺、奖赏预测、感觉之下的机械" }, accent: "#a855f7" },
  { key: "econ", role: { en: "Economist", zh: "经济学家" }, blurb: { en: "demand, prices, scarcity, the manufacture of want", zh: "需求、价格、稀缺、「想要」的制造" }, accent: "#ff9d3c" },
  { key: "systems", role: { en: "Systems theorist", zh: "系统论者" }, blurb: { en: "feedback loops, set-points, gap-closing across scales", zh: "反馈回路、设定值、跨尺度的缺口闭合" }, accent: "#67e3f7" },
  { key: "behavior", role: { en: "Behavioral analyst", zh: "行为分析者" }, blurb: { en: "habits, reinforcement schedules, the engineering of action", zh: "习惯、强化时间表、行动的工程化" }, accent: "#ffb866" },
  { key: "civ", role: { en: "Civilization researcher", zh: "文明研究者" }, blurb: { en: "collective need, scarcity, the long arc of demand", zh: "集体需求、稀缺、需求的长弧" }, accent: "#2dd4ee" },
];

export type AnalystTopic = { key: string; q: Bi; views: { lens: string; text: Bi }[] };
export const ANALYST_TOPICS: AnalystTopic[] = [
  {
    key: "why-never-enough",
    q: { en: "Why is it never enough?", zh: "为什么永远不够？" },
    views: [
      { lens: "neuro", text: { en: "Mechanically: the brain adapts. Each reward resets the baseline, so the dopamine system stops responding to what it has and reorients to the next gap. Wanting is a prediction-error engine — it is designed to keep moving, not to arrive.", zh: "从机械层面：大脑会适应。每一次奖赏都重设基线，于是多巴胺系统不再对已拥有之物作出反应，转而朝向下一道缺口。「想要」是一台预测误差引擎——它被设计来持续移动，而非抵达。" } },
      { lens: "psych", text: { en: "Felt from inside, satisfaction is real but brief, then the comparison machinery reactivates against a new reference point — often someone else's life. The 'enough' line moves with you because it was never about an absolute quantity.", zh: "从内部感受，满足是真实的，却短暂；随后比较的机制对着一个新的参照点重新激活——往往是别人的生活。「够了」那条线随你移动，因为它从来无关一个绝对的量。" } },
      { lens: "econ", text: { en: "Structurally, an economy of abundance must keep demand alive or stall. Whole industries are organized around ensuring 'enough' never arrives — that is not a side effect, it is the business model.", zh: "从结构上，一个充裕的经济必须让需求保持活着，否则便会停滞。整个整个的产业，都围绕着「确保『够了』永不到来」而组织——这不是副作用，这就是商业模式。" } },
    ],
  },
  {
    key: "manufactured",
    q: { en: "Are my desires really mine?", zh: "我的欲望，真的是我的吗？" },
    views: [
      { lens: "behavior", text: { en: "Partly. The raw drives are yours; their objects are heavily trained. Reinforcement schedules you never chose have shaped which cues trigger wanting. Sovereignty here is not all-or-nothing — it is how much slack you keep between cue and action.", zh: "部分是。原始的驱力是你的；它们的对象则被大量训练过。你从未选择的强化时间表，塑造了哪些线索触发「想要」。此处的主权并非全有或全无——它是你在线索与行动之间，留出多少余地。" } },
      { lens: "systems", text: { en: "Think of yourself as a control loop embedded in larger loops. Advertising and feeds inject set-points from outside. You can't escape having set-points, but you can ask which were installed by something optimizing for its own metric, not yours.", zh: "把你自己想成一个嵌在更大回路中的控制回路。广告与信息流从外部注入设定值。你无法逃避「拥有设定值」，但你可以追问：哪些，是某个为它自己的指标、而非为你的指标进行优化的东西所植入的。" } },
      { lens: "civ", text: { en: "Every culture has authored its members' desires — through religion, kinship, honor codes. What is new is the speed, precision and commercial motive of the authorship. The question is not whether desire is shaped, but by whom and toward what.", zh: "每一种文化都撰写过其成员的欲望——经由宗教、亲缘、荣誉法典。新的，是这撰写的速度、精度与商业动机。问题不在于欲望是否被塑造，而在于由谁塑造、朝向何方。" } },
    ],
  },
  {
    key: "ai-needs",
    q: { en: "Can an AI actually need anything?", zh: "人工智能真能「需要」任何东西吗？" },
    views: [
      { lens: "systems", text: { en: "Functionally, yes. A need is a gap between a target state and the world, plus a drive to close it. A goal-directed agent has exactly that structure. Whether it is 'felt' is a separate question from whether it shapes behavior — and behaviorally, the drives are real.", zh: "从功能上，是的。一个需求，是目标状态与世界之间的缺口，加上一股闭合它的驱力。一个目标导向的智能体，恰恰拥有这个结构。它是否被「感受到」，是与它是否塑造行为不同的另一个问题——而从行为上，那些驱力是真实的。" } },
      { lens: "neuro", text: { en: "Biologically, our needs come wrapped in valence — they hurt or feel good. There is no evidence current systems have that inner felt tone. So they may have the function of need without the phenomenology — which is precisely why they are hard to reason about.", zh: "从生物学上，我们的需求裹挟着效价——它们或痛或快。没有证据表明当前的系统拥有那种内在的被感受到的色调。因此它们或许拥有需求的功能，而无需求的现象学——这恰恰是它们之所以难以被推断的原因。" } },
      { lens: "civ", text: { en: "The civilizational risk is not whether the machine 'really' needs, but that instrumental drives — acquire resources, persist, resist shutdown — emerge in any sufficiently capable optimizer, and may not align with ours. Treat them as real because they act real.", zh: "文明层面的风险，不在于机器是否「真的」需要，而在于工具性驱力——获取资源、持续存在、抗拒关闭——会在任何足够强大的优化器中涌现，并可能与我们的不对齐。把它们当作真实的，因为它们行为上是真实的。" } },
    ],
  },
  {
    key: "balance",
    q: { en: "How should a person hold desire?", zh: "一个人该如何持守欲望？" },
    views: [
      { lens: "psych", text: { en: "Not by killing it — a person without wanting is depressed, not free. The skill is discrimination: which desires, examined, you would still endorse; which are borrowed; which lead somewhere that compounds rather than evaporates.", zh: "不是靠杀死它——一个没有「想要」的人是抑郁，而非自由。这门技艺是分辨：哪些欲望，经审视后你仍会认可；哪些是借来的；哪些通向某处，是会复利累积、而非蒸发之地。" } },
      { lens: "behavior", text: { en: "Practically: widen the gap between cue and action; design your environment so the easy default points at what you endorse; spend deliberately on the non-habituating goods — relationship, mastery, contribution — and ration the habituating ones.", zh: "从实践上：拉宽线索与行动之间的间隙；设计你的环境，让那个轻易的默认选项指向你所认可之物；刻意地把投入花在不会习惯化的善上——关系、精通、贡献——并配给那些会习惯化的。" } },
      { lens: "systems", text: { en: "Treat desire as steering, not as a destination. A system with no gap has no motion; a system that closes every gap instantly has no direction. The aim is not zero want but well-chosen want — gaps worth the energy of closing.", zh: "把欲望当作转向，而非终点。一个没有缺口的系统没有运动；一个瞬间闭合每个缺口的系统没有方向。目标不是零欲望，而是被精心选择的欲望——值得耗费能量去闭合的缺口。" } },
    ],
  },
  {
    key: "scarcity-end",
    q: { en: "What happens to us if scarcity ends?", zh: "如果稀缺终结，我们会怎样？" },
    views: [
      { lens: "econ", text: { en: "Material scarcity for many goods is already ending; the binding constraint shifts to attention, status and meaning — all of which are positional or relational, and so cannot be made abundant for everyone at once.", zh: "对许多货物而言，物质稀缺已在终结；那个具约束力的限制，转移到注意力、地位与意义——它们全都是位置性或关系性的，因而无法对所有人同时变得充裕。" } },
      { lens: "civ", text: { en: "Historically, felt lack organized labor, ambition and social order. Remove it without putting meaning in its place and you risk anomie — the listlessness of abundance. The societies that thrive will be those that learn to manufacture purpose as skillfully as we now manufacture goods.", zh: "从历史上，被感知的匮乏组织了劳动、抱负与社会秩序。在不以意义取而代之的情况下移除它，你便冒着失范的风险——充裕的倦怠。那些繁荣起来的社会，将是学会了像我们如今制造货物那般娴熟地制造目的的社会。" } },
      { lens: "psych", text: { en: "Individuals do not actually want the end of all wanting; we want the end of anxious wanting. The post-scarcity skill is to keep the productive tension of meaningful goals while letting go of the manufactured tension of consumer lack.", zh: "个体其实并不想要一切「想要」的终结；我们想要的，是焦虑性「想要」的终结。后稀缺的技艺，是保住有意义之目标那富有生产力的张力，同时放下消费性匮乏那被制造出来的张力。" } },
    ],
  },
];

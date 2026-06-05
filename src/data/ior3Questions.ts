export interface IOR3Question {
  id: string
  question: string
  modelAnswer: string
  keyPoints: string[]
}

export interface IOR3Chapter {
  id: string
  title: string
  questions: IOR3Question[]
}

export const ior3Chapters: IOR3Chapter[] = [
  {
    id: 'procurement',
    title: 'Chapter 1: Industrial Procurement',
    questions: [
      {
        id: 'p1',
        question: 'What significant changes did we see in the industrial procurement process of large companies over the last 25 years? What impact did these changes have on the seller? Illustrate with your own examples.',
        modelAnswer: 'Industrial procurement has evolved from a mainly operational function into a strategic business activity. Key changes include: professionalization of procurement (buyers use structured procedures, benchmarks, KPIs), distinction between direct and indirect procurement, centralisation of procurement in multinationals, focus on long-term supplier relationship management (SRM), supply chain integration, strict quality requirements and certifications, buying centres with multiple stakeholders, increased focus on risk reduction, digitalization (e-sourcing, SAP Ariba), and sustainability/ESG requirements. Impact on seller: competing on price alone is no longer sufficient. Modern sellers must act as long-term partners providing quality, innovation, reliability and value for the entire organisation.',
        keyPoints: ['Professionalization of procurement', 'Direct vs indirect procurement', 'Centralisation', 'SRM - fewer but stronger supplier relationships', 'Supply chain integration', 'Quality certifications', 'Buying centres', 'Risk reduction', 'Digitalization', 'Sustainability/ESG', 'Seller as strategic partner'],
      },
      {
        id: 'p2',
        question: 'In Industrial Sales, as a Small Local Supplier, You Have Little Chance of Getting into Business with Large Multinational Companies. Discuss This Statement.',
        modelAnswer: 'This statement is only partly true. Large multinationals often prefer large suppliers for global coverage, capacity, financial stability and certified quality. Procurement is increasingly centralised making access harder. However small local suppliers can succeed through: specialisation (unique knowhow/expertise), flexibility (quick response to changing needs), innovation (often more agile), excellent customer service, and local presence (reducing transport costs, faster delivery, local market knowledge). Small suppliers should focus on differentiation rather than competing on price. Entering a multinational\'s supplier network is difficult but not impossible for a well-positioned local supplier.',
        keyPoints: ['Statement is partly true', 'Multinationals prefer large suppliers - reasons why', 'Centralised procurement as barrier', 'Specialisation as opportunity', 'Flexibility advantage', 'Innovation advantage', 'Local presence advantage', 'Focus on differentiation not price'],
      },
      {
        id: 'p3',
        question: 'In the Procurement Process of Large Organisations, There Are Strong Group Dynamics, but We Should Also Not Lose Sight of the Psyche of the Individual Buyer. Clarify This Statement.',
        modelAnswer: 'Group dynamics: procurement decisions are made by a buying centre with buyers, users, influencers, gatekeepers and decision-makers. Each has different interests. Seller must understand who has influence and how the group functions. Psyche of individual buyer: even within a group, each person has personal motivations and concerns. Buyers try to avoid risk - they don\'t want to be blamed for bad decisions. They prefer known suppliers and proven technologies. Trust, experience, reputation and relationships influence decisions. Successful salespeople must understand both group dynamics AND individual psychology of each stakeholder.',
        keyPoints: ['Buying centre concept', '5 roles: buyers, users, influencers, gatekeepers, deciders', 'Group dynamics - different interests', 'Individual buyer psychology', 'Risk aversion', 'Trust and relationships', 'Multi-stakeholder approach needed'],
      },
      {
        id: 'p4',
        question: 'Explain the Concept of the Kraljic Matrix and Discuss the Practical Usefulness of This Tool.',
        modelAnswer: 'The Kraljic Matrix classifies purchased products based on two dimensions: profit impact and supply risk. Four categories: 1) Non-critical items (low impact, low risk) - simplify, automate, reduce admin costs. 2) Leverage items (high impact, low risk) - negotiate prices, use competition, bundle volumes. 3) Bottleneck items (low impact, high risk) - secure supply, safety stock, find alternatives. 4) Strategic items (high impact, high risk) - long-term partnerships, joint planning, co-development. Practical usefulness: helps allocate purchasing efforts efficiently, develop different strategies per category, reduce costs, improve supplier relationships and minimise supply risks.',
        keyPoints: ['Two dimensions: profit impact + supply risk', 'Non-critical items - strategy', 'Leverage items - strategy', 'Bottleneck items - strategy', 'Strategic items - strategy', 'Practical usefulness: prioritisation', 'Different strategies per category'],
      },
      {
        id: 'p5',
        question: 'Why Is Pricing in an Industrial Context Often So Complex?',
        modelAnswer: 'Industrial pricing is complex because products are rarely standardised. Key reasons: customisation (different specs per customer), large order volumes (volume discounts vary), additional services included (installation, maintenance, training), extensive negotiations on price and terms, market factors (raw material costs, exchange rates, transport), long-term contracts requiring future cost estimates, and focus on Total Cost of Ownership (TCO) rather than just purchase price. Industrial pricing is often based on value creation rather than simply production costs. This combination of customisation, negotiation, services, volume differences and long-term considerations makes pricing highly complex.',
        keyPoints: ['Customisation', 'Large order volumes and discounts', 'Additional services', 'Negotiation', 'Market factors (raw materials, exchange rates)', 'Long-term contracts', 'Total Cost of Ownership (TCO)', 'Value-based pricing'],
      },
      {
        id: 'p6',
        question: 'Strategic Decisions by Companies Sometimes Lead to a So-Called \'Nash Equilibrium\'. Explain What This Means and Illustrate with an Example.',
        modelAnswer: 'A Nash Equilibrium (game theory, John Nash) is a situation where each player makes the best choice given the choices of others, and no player can improve by changing strategy alone. In business, it often occurs in oligopolies. Classic example: two airlines on same route. Each can choose high or low price. If one lowers price, other follows. Both end up with lower prices even though both would earn more with high prices. Neither can raise price alone without losing customers. The equilibrium is stable but not optimal for either company. Lesson for entrepreneurs: analyse not just your own optimum but also competitors\' likely reactions.',
        keyPoints: ['Definition: Nash Equilibrium', 'Game theory concept', 'No player benefits from changing strategy alone', 'Occurs in oligopolies', 'Airline example', 'Stable but not necessarily optimal', 'Implications for strategic decision-making'],
      },
      {
        id: 'p7',
        question: 'After Studying This Chapter, You Can Recognise and Explain the Different Market Situations Using a Blind Graph. Give Interpretation to the Drawing.',
        modelAnswer: 'Four market structures: 1) Perfect competition - many buyers and sellers, homogeneous products, no pricing power, price determined by supply and demand (e.g. wheat, basic raw materials). 2) Monopoly - one seller, many buyers, significant pricing power, high prices possible (e.g. patented medicines, public utilities). 3) Oligopoly - few large companies, strategic behaviour important, companies monitor each other (e.g. Boeing/Airbus, Apple/Samsung). 4) Monopolistic competition - many companies, differentiated products, some pricing power through branding/quality (e.g. restaurants, clothing brands). For procurement: in perfect competition buyers have strong negotiating power; in monopoly buyers have fewer options; in oligopoly long-term relationships become more important.',
        keyPoints: ['Perfect competition - characteristics', 'Monopoly - characteristics', 'Oligopoly - characteristics and strategic behaviour', 'Monopolistic competition - characteristics', 'Implications for procurement/bargaining power', 'Ability to interpret graphs'],
      },
    ],
  },
  {
    id: 'kaizen',
    title: 'Chapter 2: Kaizen & Continuous Improvement',
    questions: [
      {
        id: 'k1',
        question: 'Discuss and Explain the Attitude of Trade Unions in a Western Company Towards the Implementation of Kaizen Principles.',
        modelAnswer: 'Trade unions have a mixed attitude towards Kaizen. Positive aspects: unions appreciate employee involvement in decision-making, Kaizen can increase job satisfaction, improve communication with management and provide learning opportunities. Concerns: fear that productivity improvements lead to job losses or downsizing, continuous improvement can increase work pressure, cultural difference between Japan (long-term employment, loyalty) and Western countries (less job security). Unions support employee participation but remain cautious about job security and workload impact. Their support depends on whether benefits are shared fairly between company and employees.',
        keyPoints: ['Mixed attitude', 'Positive: employee involvement', 'Positive: job satisfaction and learning', 'Concern: job losses', 'Concern: increased work pressure', 'Cultural difference Japan vs West', 'Conditions for union support'],
      },
      {
        id: 'k2',
        question: 'Is It Important for a Business-to-Business Salesperson to Know Whether or Not His Industrial Customers Operate According to Kaizen Principles? Explain Your Answer.',
        modelAnswer: 'Yes, very important. Kaizen-oriented companies constantly look for ways to improve processes and increase productivity. A salesperson who understands this can adapt their approach: instead of focusing on price/features, explain how product contributes to efficiency, quality improvement and cost reduction. Kaizen companies prefer long-term partnerships with suppliers who actively contribute ideas. The salesperson should position themselves as a partner helping the customer improve performance. Example: selling machinery to Kaizen manufacturer - emphasise waste reduction, workflow improvement and productivity increase rather than just technical specs.',
        keyPoints: ['Yes - important', 'Kaizen customers focus on continuous improvement', 'Adapt sales approach accordingly', 'Focus on efficiency/quality/cost reduction not just price', 'Long-term partnership preferred', 'Position as improvement partner not just seller', 'Concrete example required'],
      },
      {
        id: 'k3',
        question: 'Discuss the Differences (and the Implications Thereof) Between Western and Japanese Companies When Looking at Their PDCA Cycle.',
        modelAnswer: 'PDCA = Plan-Do-Check-Act. Japanese companies: view PDCA as continuous never-ending process, focus strongly on the process itself, all levels involved, emphasis on small incremental improvements, strong Check and Act phases, culture of collective responsibility. Western companies: more result-oriented, use PDCA more as project management tool, focus on Plan and Do phases, less attention to Check and Act, faster short-term results but less long-term process optimisation. Implication: Japanese approach achieves high quality and employee involvement through continuous improvement. Western approach may be faster but less systematic. Example: production problem - Japanese company analyses root cause and involves employees; Western company focuses on solving immediate problem quickly.',
        keyPoints: ['PDCA definition', 'Japanese: continuous philosophy, all levels, incremental', 'Western: result-oriented, project tool', 'Japanese: strong Check+Act phases', 'Western: focus on Plan+Do', 'Implication: quality vs speed', 'Cultural difference'],
      },
      {
        id: 'k4',
        question: 'The Japanese Kaizen Approach Is Far from Perfect. Give and Discuss the Main Reservations About the Kaizen Philosophy.',
        modelAnswer: 'Main reservations: 1) Focus on incremental improvement, not radical innovation - insufficient for disruptive technologies or rapidly changing markets. 2) Slow process - significant results take long time, not suitable for urgent challenges. 3) Work pressure - can lead to higher expectations and fears of job losses, creating employee resistance. 4) Cultural transferability - strongly linked to Japanese values (teamwork, loyalty, long-term employment) that don\'t automatically fit Western organisations. 5) Overlooks new opportunities - strong focus on improving existing processes may cause companies to miss disruptive innovations. Best companies combine Kaizen with radical innovation strategies.',
        keyPoints: ['Incremental not radical innovation', 'Slow process', 'Increased work pressure', 'Cultural transferability issues', 'Risk of missing disruptive innovation', 'Local optimisation problem', 'Combination with radical innovation needed'],
      },
      {
        id: 'k5',
        question: 'Describe and Discuss the Toyota Production System (TPS).',
        modelAnswer: 'TPS is a production and management philosophy developed by Toyota, foundation of Lean Manufacturing. Main objective: maximise customer value while minimising waste. Two main pillars: 1) Just-In-Time (JIT) - produce and deliver only what is needed, when needed, in exact quantity required. Reduces inventory, avoids overproduction. 2) Jidoka - quality built into the process, machines/employees stop when defect occurs, problems solved at source. Other principles: elimination of Muda (7 types of waste: overproduction, waiting, transport, inventory, motion, overprocessing, defects + unused talent), continuous Kaizen improvement, Heijunka (production levelling), Gemba (go to where work happens), respect for people. Advantages: higher quality, lower costs, efficiency. Limitations: vulnerable to supply chain disruptions, requires high discipline.',
        keyPoints: ['Definition and objective', 'Just-In-Time pillar', 'Jidoka pillar', '7 types of Muda', 'Kaizen as central principle', 'Heijunka', 'Gemba/Genchi Genbutsu', 'Respect for people', 'Advantages and limitations'],
      },
      {
        id: 'k6',
        question: 'Discuss and Illustrate the Japanese Keiretsu and Korean Chaebol Holding Structures. What Are the Possible Advantages and Disadvantages of Such Organisational Structures?',
        modelAnswer: 'Keiretsu (Japan): network of companies linked through cross-shareholdings and long-term relationships. Companies remain legally independent. Two types: horizontal (companies from different industries around central bank, e.g. Mitsubishi) and vertical (producer with suppliers/distributors, e.g. Toyota). Chaebol (South Korea): large conglomerate controlled by single family. Centralised ownership and management. Examples: Samsung, Hyundai, LG, SK. Advantages: long-term thinking, access to capital, cooperation between companies, supply chain stability, scale for R&D and innovation. Disadvantages: closed networks (hard for outsiders), less competition, transparency issues, family control governance problems, too-big-to-fail systemic risk. For B2B seller: market access is relational and structural - need partnerships, local presence and patience.',
        keyPoints: ['Keiretsu definition', 'Horizontal vs vertical Keiretsu', 'Chaebol definition', 'Family control in Chaebol', 'Examples of both', 'Advantages: stability, capital, cooperation', 'Disadvantages: closed networks, governance', 'Implications for B2B sellers'],
      },
    ],
  },
  {
    id: 'ip',
    title: 'Chapter 3: Intellectual Property',
    questions: [
      {
        id: 'ip1',
        question: 'What Elements Fall Under the Heading of \'Intellectual Property\'? Discuss Briefly and Indicate for Each of Them What Possibilities a Company Has to Protect Them.',
        modelAnswer: 'IP includes: 1) Patent - protects new inventions/technologies, filed with patent office, lasts 20 years. 2) Trademark - protects brand names, logos, symbols, protected through registration, renewable indefinitely. 3) Industrial design - protects visual appearance of products, obtained through design registration. 4) Copyright - protects creative works (books, music, software, art), arises automatically, lasts lifetime + several decades. 5) Trade secrets - formulas, production methods, databases, protected through NDAs, confidentiality agreements and internal security. Other: trade names, domain names, plant breeders rights. Key principle: territoriality - IP rights apply per territory, international entrepreneurs must protect in each key market.',
        keyPoints: ['Patent - definition and protection', 'Trademark - definition and protection', 'Industrial design', 'Copyright - automatic protection', 'Trade secrets - NDAs and security', 'Territoriality principle', 'Each element with its specific protection method'],
      },
      {
        id: 'ip2',
        question: '\'To Patent or Not to Patent?\' The Company Is Unsure Whether to Patent Its Inventions or Not. What Are Possible Arguments For and Against Patenting? Illustrate with Your Own Examples.',
        modelAnswer: 'Arguments FOR patenting: exclusive rights for 20 years, protection from competitors copying innovation, competitive advantage, income through licensing agreements, increases company value. Example: battery technology company patents invention and licenses to EV manufacturers. Arguments AGAINST patenting: expensive to obtain and maintain (especially internationally), requires public disclosure of how invention works, competitors may find alternative solutions, after expiry anyone can use technology freely. Alternative - trade secret: Coca-Cola formula never patented, protected for over a century as secret. Companies must evaluate whether patent or trade secret better supports long-term strategy.',
        keyPoints: ['Arguments FOR: exclusive rights, competitive advantage, licensing income', 'Arguments AGAINST: cost, public disclosure, workarounds', 'Trade secret as alternative', 'Coca-Cola example', 'Strategic decision based on company situation', 'Own examples required'],
      },
      {
        id: 'ip3',
        question: 'Describe and Discuss the Timeline from Initial Application to Eventual Expiry of a Patent.',
        modelAnswer: 'Patent timeline: 1) Invention must meet 3 conditions: new, inventive step, industrially applicable. 2) Patent application filed with national/European/international office - contains description, drawings, claims. Filing date establishes priority rights. 3) After 18 months: application published publicly - technical details available but patent not yet granted. 4) Examination by patent office (can take years) - questions, clarifications, modifications. 5) Patent granted - exclusive rights to use, manufacture, sell or license. Annual maintenance fees required. 6) Protection lasts 20 years from filing date. 7) Patent expires - enters public domain, anyone can use freely. Example: pharmaceutical patents - after expiry generic manufacturers produce cheaper versions.',
        keyPoints: ['3 conditions: new, inventive, applicable', 'Application and filing date', '18 months: publication', 'Examination process', 'Grant of patent', '20 years from filing date', 'Expiry and public domain', 'Pharmaceutical example'],
      },
      {
        id: 'ip4',
        question: 'How Can You Monetise a Patent? Illustrate with Your Own Examples.',
        modelAnswer: 'Ways to monetise a patent: 1) Direct commercialisation - use patent yourself to produce and sell exclusively. Example: company patents biodegradable packaging and sells it. 2) Licensing - allow others to use technology for royalties/fees without manufacturing yourself. Example: battery technology licensed to EV manufacturers. 3) Sell the patent entirely - transfer ownership for one-time payment, attractive for small companies lacking resources. 4) Strategic partnerships/joint ventures - cooperate with other companies to develop and market technology. 5) Attract investors - strong patent portfolio increases company value and demonstrates innovation capability. Best strategy depends on company resources, objectives and market position.',
        keyPoints: ['Direct commercialisation', 'Licensing and royalties', 'Selling the patent', 'Strategic partnerships', 'Attracting investors', 'Own examples required', 'Strategy depends on company situation'],
      },
      {
        id: 'ip5',
        question: 'Why Would an International Entrepreneur Want to Consult Patent Databases from Time to Time?',
        modelAnswer: 'Reasons to consult patent databases: 1) Monitor competitors - patent applications reveal which technologies competitors are developing and where they invest. 2) Avoid patent infringement - check before launching new product whether similar technologies are already protected, reduces risk of legal disputes. 3) Identify innovation opportunities - discover technologies available for licensing or collaboration. 4) Study expired patents - available in public domain, can be used freely. 5) Freedom to operate analysis - ensure new product doesn\'t infringe existing patents. Example: entrepreneur developing medical device checks databases to verify technology is unique, analyse competing solutions and identify partners. Patent databases are valuable for competitive intelligence, innovation management, risk reduction and strategic decision-making.',
        keyPoints: ['Monitor competitors', 'Avoid infringement', 'Identify licensing opportunities', 'Study expired patents', 'Freedom to operate', 'Competitive intelligence', 'Own example required'],
      },
      {
        id: 'ip6',
        question: 'China on the One Hand and the EU/US on the Other Do Not Always Agree When It Comes to Intellectual Property Protection. Discuss a Recent Example.',
        modelAnswer: 'Recent example: semiconductor industry conflict. US imposed restrictions on export of advanced chips and chip-making technology to China, arguing IP and national security must be protected. China claims measures are intended to slow technological development rather than protect IP. Background: US companies have long accused China of insufficient IP protection, patent infringement and unauthorised use of foreign technologies. China has strengthened IP laws: specialised IP courts, increased penalties, improved legal protection. However Western companies still believe enforcement is weaker than in EU/US. Cultural difference: Western countries view IP as private right rewarding innovation; Chinese culture historically emphasised learning through imitation. Changing situation: as Chinese companies (Huawei, Tencent, BYD) develop own technologies, China becomes more interested in protecting IP.',
        keyPoints: ['Semiconductor industry example', 'US export restrictions', 'Chinese response', 'History of IP disputes', 'China\'s improving IP laws', 'Cultural difference in IP view', 'Changing situation as China develops own IP'],
      },
    ],
  },
  {
    id: 'diversity',
    title: 'Chapter 4: Diversity & Talent',
    questions: [
      {
        id: 'd1',
        question: 'Define Diversity and Explain Why It Can Be an Asset for Companies (Micro-Level) as Well as for Cities and Countries (Macro-Level).',
        modelAnswer: 'Diversity: presence of differences among people in terms of nationality, ethnicity, gender, age, religion, education, skills, experience and cultural background. Micro-level (companies): diverse employees contribute unique ideas stimulating creativity and innovation, diverse teams better at problem-solving (multiple perspectives), helps companies understand different customer groups and international markets, improves reputation and attracts talent. Macro-level (cities/countries): promotes economic growth, innovation and international competitiveness, attracts skilled workers, entrepreneurs and investors, different cultures contribute new ideas and business opportunities, strengthens international networks. Important: diversity only creates value when combined with inclusion and mutual respect. Without integration, differences may lead to misunderstandings.',
        keyPoints: ['Definition of diversity', 'Micro-level: creativity and innovation', 'Micro-level: problem-solving', 'Micro-level: customer understanding', 'Macro-level: economic growth', 'Macro-level: attracting talent', 'Macro-level: international networks', 'Inclusion needed for value creation'],
      },
      {
        id: 'd2',
        question: 'Discuss the Theory Behind the GTCI-Index and Explain Why It Can Be Useful for an International Entrepreneur.',
        modelAnswer: 'GTCI = Global Talent Competitiveness Index. Theory: talent has become the most important driver of economic growth, innovation and competitiveness in the modern knowledge economy. Countries compete through quality of human capital, not just natural resources or low labour costs. GTCI evaluates countries on: ability to enable talent, attract talent, grow talent (education/training), retain skilled workers, transform talent into vocational and global knowledge skills. Useful for international entrepreneur: identifies countries where skilled employees are available, helps decide where to invest or open subsidiary, assesses quality of local talent pool, provides insight into country\'s future economic potential, helps compare countries and identify risks related to talent shortages.',
        keyPoints: ['GTCI definition', 'Theory: talent as key competitive factor', 'Knowledge economy', '5 dimensions of GTCI', 'Useful for: investment location decisions', 'Useful for: recruitment', 'Useful for: assessing innovation potential', 'Country comparison tool'],
      },
    ],
  },
]

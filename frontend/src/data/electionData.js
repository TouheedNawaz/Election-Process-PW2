export const electionData = {
  india: {
    id: 'india',
    name: 'India',
    flagUrl: 'https://flagcdn.com/in.svg',
    body: 'Election Commission of India (ECI)',
    system: 'First-Past-The-Post (FPTP) for Lok Sabha',
    steps: [
      {
        id: 'in-1',
        title: 'Election Announcement',
        duration: '70-80 days before polling',
        description: 'The ECI announces the election schedule. The Model Code of Conduct (MCC) comes into effect immediately, restricting the ruling government from announcing new schemes that could influence voters.'
      },
      {
        id: 'in-2',
        title: 'Voter Registration',
        duration: 'Ongoing until nominations',
        description: 'Citizens above 18 can register on the electoral roll. The final voter list is published before the nomination process begins.'
      },
      {
        id: 'in-3',
        title: 'Candidate Nominations',
        duration: '7-10 days',
        description: 'Candidates file their nomination papers along with an affidavit detailing their criminal record, assets, and liabilities.'
      },
      {
        id: 'in-4',
        title: 'Campaign Period',
        duration: '14 days minimum',
        description: 'Political parties and candidates campaign. Campaigning officially stops 48 hours before the polling begins (Silence Period).'
      },
      {
        id: 'in-5',
        title: 'Polling Day(s)',
        duration: 'Multi-phase (up to 7 phases)',
        description: 'Voters cast their votes using Electronic Voting Machines (EVMs) and Voter Verifiable Paper Audit Trail (VVPAT) machines across designated polling stations.'
      },
      {
        id: 'in-6',
        title: 'Counting & Results',
        duration: '1 day',
        description: 'Votes from EVMs are counted under heavy security. The candidate with the highest number of votes in a constituency wins.'
      },
      {
        id: 'in-7',
        title: 'Government Formation',
        duration: 'Post-results',
        description: 'The party or coalition with a majority (272+ seats) in the Lok Sabha is invited by the President to form the government.'
      }
    ]
  },
  pakistan: {
    id: 'pakistan',
    name: 'Pakistan',
    flagUrl: 'https://flagcdn.com/pk.svg',
    body: 'Election Commission of Pakistan (ECP)',
    system: 'First-Past-The-Post + Reserved Seats',
    steps: [
      {
        id: 'pk-1',
        title: 'Dissolution of Assemblies',
        duration: 'Before elections',
        description: 'The National and Provincial Assemblies are dissolved at the end of their 5-year term, or earlier by the President/Governors.'
      },
      {
        id: 'pk-2',
        title: 'Caretaker Government',
        duration: '60 to 90 days',
        description: 'A neutral caretaker government is appointed to oversee the country and ensure free and fair elections during the transition.'
      },
      {
        id: 'pk-3',
        title: 'Delimitation & Electoral Rolls',
        duration: 'Pre-election phase',
        description: 'The ECP finalizes constituency boundaries (delimitation) based on the latest census and updates the computerized electoral rolls.'
      },
      {
        id: 'pk-4',
        title: 'Scrutiny of Nominations',
        duration: '1-2 weeks',
        description: 'Candidates file nomination papers. Returning Officers scrutinize them to ensure candidates meet Articles 62 and 63 of the Constitution.'
      },
      {
        id: 'pk-5',
        title: 'Campaign & Polling',
        duration: '1 day for polling',
        description: 'Voters cast paper ballots stamped with their choice. Polling is held simultaneously for National and Provincial Assemblies.'
      },
      {
        id: 'pk-6',
        title: 'Results Consolidation',
        duration: '2-3 days',
        description: 'Votes are counted manually. The ECP compiles results using forms (Form 45, Form 47) and announces provisional and final results.'
      }
    ]
  },
  bangladesh: {
    id: 'bangladesh',
    name: 'Bangladesh',
    flagUrl: 'https://flagcdn.com/bd.svg',
    body: 'Election Commission Bangladesh',
    system: 'First-Past-The-Post for Jatiya Sangsad',
    steps: [
      {
        id: 'bd-1',
        title: 'Schedule Announcement',
        duration: '90 days before expiry',
        description: 'The Election Commission announces the detailed schedule for the Jatiya Sangsad (Parliament) elections.'
      },
      {
        id: 'bd-2',
        title: 'Electoral Roll Updates',
        duration: 'Annual + Pre-election',
        description: 'The voter list is updated. Citizens are provided with National ID (NID) cards which are crucial for the voting process.'
      },
      {
        id: 'bd-3',
        title: 'Nominations & Withdrawal',
        duration: '1-2 weeks',
        description: 'Candidates submit nominations. There is a specific period during which candidates can withdraw their names.'
      },
      {
        id: 'bd-4',
        title: 'Campaigning',
        duration: '21 days usually',
        description: 'Intense campaigning occurs. Posters, rallies, and public address systems are widely used within electoral code limits.'
      },
      {
        id: 'bd-5',
        title: 'Voting Day',
        duration: '1 day',
        description: 'Citizens vote using traditional paper ballots (EVMs have been used selectively in some areas in recent years).'
      },
      {
        id: 'bd-6',
        title: 'Gazette Notification',
        duration: 'Post-counting',
        description: 'After counting is completed at polling centers and consolidated, the Election Commission publishes the official gazette of winning candidates.'
      }
    ]
  }
};

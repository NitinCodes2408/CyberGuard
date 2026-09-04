// Threat Intelligence Knowledge Base for UNSW-NB15 Classification Categories
// Provides real-world SOC context, severity metrics, technical explanations, and actionable mitigation playbooks.

export const THREAT_INTELLIGENCE = {
  Exploits: {
    name: 'Exploits',
    severity: 'CRITICAL',
    severityScore: '9.8 / 10',
    severityColor: 'text-rose-400 bg-rose-950/80 border-rose-500/60',
    mitreTactic: 'Initial Access / Execution (T1190)',
    explanation:
      'Malicious code sequence exploiting software vulnerabilities (e.g., buffer overflows, memory corruption, return-oriented programming) to bypass host security controls and execute arbitrary commands.',
    defensiveActions: [
      'Immediately isolate the compromised host from the internal production VLAN.',
      'Deploy network-level virtual patches or WAF rules targeting known CVE signatures.',
      'Capture full memory dump and process execution logs for root-cause forensic analysis.',
      'Verify host endpoint protection (EDR) agents and enforce principle of least privilege.',
    ],
    riskLevel: 'Immediate system takeover and lateral movement potential.',
  },

  DoS: {
    name: 'Denial of Service (DoS)',
    severity: 'HIGH',
    severityScore: '8.5 / 10',
    severityColor: 'text-red-400 bg-red-950/80 border-red-500/60',
    mitreTactic: 'Impact / Resource Hijacking (T1498, T1499)',
    explanation:
      'Anomalous high-frequency packet flood designed to exhaust target server resources (CPU, TCP connection state tables, memory, or bandwidth) and render services unavailable to legitimate users.',
    defensiveActions: [
      'Enable perimeter SYN cookies and connection rate-limiting on upstream routers.',
      'Blackhole (null-route) the attacking IP addresses or activate cloud anti-DDoS scrubbing.',
      'Throttle aggressive connection state transitions at the stateful inspection firewall.',
      'Scale target application endpoints dynamically across redundant availability zones.',
    ],
    riskLevel: 'Severe service downtime, customer disruption, and SLA breach risk.',
  },

  Backdoor: {
    name: 'Backdoor',
    severity: 'CRITICAL',
    severityScore: '9.5 / 10',
    severityColor: 'text-rose-400 bg-rose-950/80 border-rose-500/60',
    mitreTactic: 'Persistence / Command & Control (T1059, T1071)',
    explanation:
      'Covert channel traffic establishing persistent remote administrative access, bypassing normal authentication mechanisms and beaconing to external Command & Control (C2) servers.',
    defensiveActions: [
      'Terminate active network sockets to the suspicious remote destination IP and port.',
      'Revoke credentials and active authentication tokens associated with the session.',
      'Inspect endpoint scheduled tasks, persistence registry keys, and system startup hooks.',
      'Perform thorough lateral movement audit on domain controllers and adjacent hosts.',
    ],
    riskLevel: 'Prolonged undetected persistent attacker presence inside enterprise network.',
  },

  Fuzzers: {
    name: 'Fuzzers',
    severity: 'MEDIUM',
    severityScore: '6.5 / 10',
    severityColor: 'text-amber-400 bg-amber-950/80 border-amber-500/60',
    mitreTactic: 'Discovery / Vulnerability Probing (T1595.002)',
    explanation:
      'Automated high-volume generation of randomized, unexpected, or malformed protocol payloads aimed at discovering unhandled application exceptions, buffer overruns, or crashes.',
    defensiveActions: [
      'Enable strict input validation and boundary sanitation on API and web endpoints.',
      'Deploy rate-limiting per source IP to prevent automated fuzzing tool enumeration.',
      'Inspect application crash and error logs for signs of abnormal thread termination.',
      'Update edge firewall rules to drop non-RFC-compliant protocol formatting.',
    ],
    riskLevel: 'Precursor to targeted zero-day exploit weaponization.',
  },

  Reconnaissance: {
    name: 'Reconnaissance',
    severity: 'MEDIUM',
    severityScore: '5.5 / 10',
    severityColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/60',
    mitreTactic: 'Reconnaissance / Network Scanning (T1595.001)',
    explanation:
      'Systematic port sweeping, host pinging, and banner grabbing designed to identify active hosts, open ports, OS versions, and exposed services for future exploitation.',
    defensiveActions: [
      'Enforce perimeter firewall rules to block ICMP sweeps and unauthorized port probing.',
      'Configure network intrusion prevention (IPS) to automatically drop scanning source IPs.',
      'Mask application and service banners to prevent technological footprint disclosure.',
      'Deploy honeypot deception decoys to identify internal reconnaissance attempts.',
    ],
    riskLevel: 'Pre-attack intelligence gathering mapping vulnerabilities for subsequent intrusion.',
  },

  Generic: {
    name: 'Generic',
    severity: 'LOW',
    severityScore: '5.0 / 10',
    severityColor: 'text-purple-400 bg-purple-950/80 border-purple-500/60',
    mitreTactic: 'Defense Evasion / Protocol Deviation (T1036)',
    explanation:
      'Traffic patterns deviating significantly from standard cryptographic or protocol standards, often generated by cryptographic collision techniques or non-standard tunneling.',
    defensiveActions: [
      'Enforce strict protocol compliance filters on layer-7 next-generation firewalls (NGFW).',
      'Log and monitor the specific protocol deviation for repetition or correlated alerts.',
      'Verify whether custom non-standard internal enterprise tooling generated the flow.',
    ],
    riskLevel: 'Anomalous deviation requiring monitoring and compliance enforcement.',
  },

  Analysis: {
    name: 'Analysis',
    severity: 'MEDIUM',
    severityScore: '6.0 / 10',
    severityColor: 'text-blue-400 bg-blue-950/80 border-blue-500/60',
    mitreTactic: 'Discovery / System Information Discovery (T1082)',
    explanation:
      'Network probing targeting application-specific vulnerabilities such as directory traversal, parameter tampering, and server configuration testing.',
    defensiveActions: [
      'Inspect web server and reverse proxy logs for directory brute-forcing sequences.',
      'Ensure web application firewall (WAF) rule sets are actively inspecting query parameters.',
      'Disable directory browsing and restrict access to configuration directories.',
    ],
    riskLevel: 'Targeted application layer vulnerability assessment.',
  },

  Shellcode: {
    name: 'Shellcode',
    severity: 'CRITICAL',
    severityScore: '9.6 / 10',
    severityColor: 'text-rose-400 bg-rose-950/80 border-rose-500/60',
    mitreTactic: 'Execution / Command & Scripting Interpreter (T1059)',
    explanation:
      'Compact machine code instructions injected into running process address spaces to spawn interactive shell processes or execute privilege escalation payloads.',
    defensiveActions: [
      'Enable Data Execution Prevention (DEP) and Address Space Layout Randomization (ASLR).',
      'Terminate suspicious parent-child process relationships (e.g. web server spawning cmd.exe).',
      'Isolate the compromised server node immediately and initiate memory forensics.',
    ],
    riskLevel: 'Critical interactive shell access and immediate machine takeover.',
  },

  Worms: {
    name: 'Worms',
    severity: 'HIGH',
    severityScore: '8.8 / 10',
    severityColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/60',
    mitreTactic: 'Lateral Movement / Replication (T1080)',
    explanation:
      'Self-replicating malicious software designed to autonomously propagate across network connections by exploiting unpatched vulnerabilities without user interaction.',
    defensiveActions: [
      'Implement micro-segmentation to restrict East-West internal traffic traversal.',
      'Patch the exploited network service across all vulnerable hosts immediately.',
      'Deploy network IPS signatures to block replication payload signatures on wire.',
    ],
    riskLevel: 'High risk of autonomous cascading infection across enterprise network.',
  },
};

/**
 * Returns threat intelligence details for a given attack type.
 * Provides fallback defaults for unknown or unclassified attacks.
 */
export function getThreatIntelligence(attackType) {
  if (!attackType || attackType === 'None' || attackType === 'Normal') {
    return {
      name: 'None',
      severity: 'BENIGN',
      severityScore: '0.0 / 10',
      severityColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/60',
      mitreTactic: 'Baseline Operations',
      explanation:
        'The dual-stage Random Forest ensemble evaluated all 42 statistical telemetry features (packet intervals, TCP handshake timings, connection states, and byte ratios) and verified that all patterns strictly match legitimate baseline network behavior.',
      defensiveActions: [
        'No defensive intervention required.',
        'Continuous monitoring active in telemetry stream.',
        'Transaction logged to SQLite audit database for baseline integrity verification.',
      ],
      riskLevel: 'Safe - Zero indicators of compromise detected.',
    };
  }

  // Look up threat in dictionary, or return high-severity default
  const threat = THREAT_INTELLIGENCE[attackType];
  if (threat) return threat;

  return {
    name: attackType,
    severity: 'HIGH',
    severityScore: '8.0 / 10',
    severityColor: 'text-rose-400 bg-rose-950/80 border-rose-500/60',
    mitreTactic: 'Unclassified Anomaly',
    explanation: `Anomalous pattern identified by the multi-class attack classifier as [${attackType}], presenting significant deviations from baseline network metrics.`,
    defensiveActions: [
      'Block the source address at the perimeter firewall.',
      'Inspect connection telemetry and packet capture for indicators of compromise.',
      'Cross-reference destination IP and port with threat intelligence feeds.',
    ],
    riskLevel: 'High anomaly requiring immediate SOC analyst review.',
  };
}

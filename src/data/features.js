// Feature definitions and categorization for the 42 network traffic metrics

export const FEATURE_GROUPS = [
  {
    id: 'basic',
    name: 'Basic Traffic',
    icon: 'Radio',
    description: 'Protocol, transaction duration, application service and connection state',
    features: [
      { key: 'dur', label: 'Duration (s)', type: 'number', step: 'any', tooltip: 'Record total duration in seconds' },
      { 
        key: 'proto', 
        label: 'Protocol', 
        type: 'select', 
        options: ['tcp', 'udp', 'arp', 'ospf', 'icmp', 'igmp', 'gre', 'pnni', 'unas', 'sctp', 'ip', 'ggp'],
        tooltip: 'Transport or network protocol' 
      },
      { 
        key: 'service', 
        label: 'Service', 
        type: 'select', 
        options: ['-', 'http', 'dns', 'ftp', 'ftp-data', 'smtp', 'ssh', 'pop3', 'ssl', 'snmp', 'dhcp', 'radius', 'irc'],
        tooltip: 'Destination network service' 
      },
      { 
        key: 'state', 
        label: 'State', 
        type: 'select', 
        options: ['FIN', 'INT', 'CON', 'REQ', 'RST', 'ECO', 'CLO', 'ACC', 'PAR'],
        tooltip: 'Connection state or TCP flag representation' 
      },
    ]
  },
  {
    id: 'packets',
    name: 'Packet Statistics',
    icon: 'Layers',
    description: 'Source and destination packet counts, volume, and bit rates',
    features: [
      { key: 'spkts', label: 'Source Packets (spkts)', type: 'number', step: '1', tooltip: 'Source to destination packet count' },
      { key: 'dpkts', label: 'Destination Packets (dpkts)', type: 'number', step: '1', tooltip: 'Destination to source packet count' },
      { key: 'sbytes', label: 'Source Bytes (sbytes)', type: 'number', step: '1', tooltip: 'Source to destination transaction bytes' },
      { key: 'dbytes', label: 'Destination Bytes (dbytes)', type: 'number', step: '1', tooltip: 'Destination to source transaction bytes' },
      { key: 'rate', label: 'Packet Rate (pkts/s)', type: 'number', step: 'any', tooltip: 'Total packets per second' },
    ]
  },
  {
    id: 'metrics',
    name: 'Traffic Metrics',
    icon: 'Cpu',
    description: 'Time To Live, load, packet loss, jitter and TCP handshake timing',
    features: [
      { key: 'sttl', label: 'Source TTL (sttl)', type: 'number', step: '1', tooltip: 'Source to destination time to live' },
      { key: 'dttl', label: 'Destination TTL (dttl)', type: 'number', step: '1', tooltip: 'Destination to source time to live' },
      { key: 'sload', label: 'Source Load (sload)', type: 'number', step: 'any', tooltip: 'Source bits per second' },
      { key: 'dload', label: 'Destination Load (dload)', type: 'number', step: 'any', tooltip: 'Destination bits per second' },
      { key: 'sloss', label: 'Source Loss (sloss)', type: 'number', step: '1', tooltip: 'Source packets retransmitted or dropped' },
      { key: 'dloss', label: 'Destination Loss (dloss)', type: 'number', step: '1', tooltip: 'Destination packets dropped' },
      { key: 'sinpkt', label: 'Source Inter-packet (sinpkt)', type: 'number', step: 'any', tooltip: 'Source inter-packet arrival time (msec)' },
      { key: 'dinpkt', label: 'Dest Inter-packet (dinpkt)', type: 'number', step: 'any', tooltip: 'Destination inter-packet arrival time (msec)' },
      { key: 'sjit', label: 'Source Jitter (sjit)', type: 'number', step: 'any', tooltip: 'Source jitter (msec)' },
      { key: 'djit', label: 'Destination Jitter (djit)', type: 'number', step: 'any', tooltip: 'Destination jitter (msec)' },
      { key: 'swin', label: 'Source TCP Window (swin)', type: 'number', step: '1', tooltip: 'Source TCP window advertisement value' },
      { key: 'stcpb', label: 'Source TCP Seq (stcpb)', type: 'number', step: '1', tooltip: 'Source TCP base sequence number' },
      { key: 'dtcpb', label: 'Dest TCP Seq (dtcpb)', type: 'number', step: '1', tooltip: 'Destination TCP base sequence number' },
      { key: 'dwin', label: 'Dest TCP Window (dwin)', type: 'number', step: '1', tooltip: 'Destination TCP window advertisement value' },
      { key: 'tcprtt', label: 'TCP RTT (tcprtt)', type: 'number', step: 'any', tooltip: 'TCP round trip time (sec)' },
      { key: 'synack', label: 'SYN-ACK Time (synack)', type: 'number', step: 'any', tooltip: 'TCP SYN to SYN-ACK duration (sec)' },
      { key: 'ackdat', label: 'ACK-DATA Time (ackdat)', type: 'number', step: 'any', tooltip: 'TCP SYN-ACK to ACK duration (sec)' },
      { key: 'smean', label: 'Source Mean Size (smean)', type: 'number', step: 'any', tooltip: 'Mean packet size transmitted by source' },
      { key: 'dmean', label: 'Dest Mean Size (dmean)', type: 'number', step: 'any', tooltip: 'Mean packet size transmitted by destination' },
    ]
  },
  {
    id: 'connections',
    name: 'Connection Statistics',
    icon: 'Network',
    description: 'Aggregated flow statistics across 100 historical connections',
    features: [
      { key: 'ct_srv_src', label: 'ct_srv_src', type: 'number', step: '1', tooltip: 'No. of connections with same service and source address' },
      { key: 'ct_state_ttl', label: 'ct_state_ttl', type: 'number', step: '1', tooltip: 'No. of connections for each state according to TTL' },
      { key: 'ct_dst_ltm', label: 'ct_dst_ltm', type: 'number', step: '1', tooltip: 'No. of connections to same destination in last 100 connections' },
      { key: 'ct_src_dport_ltm', label: 'ct_src_dport_ltm', type: 'number', step: '1', tooltip: 'No. of connections from same source to same destination port' },
      { key: 'ct_dst_sport_ltm', label: 'ct_dst_sport_ltm', type: 'number', step: '1', tooltip: 'No. of connections to same destination from same source port' },
      { key: 'ct_dst_src_ltm', label: 'ct_dst_src_ltm', type: 'number', step: '1', tooltip: 'No. of connections between same source and destination' },
      { key: 'ct_src_ltm', label: 'ct_src_ltm', type: 'number', step: '1', tooltip: 'No. of connections from same source in last 100 connections' },
      { key: 'ct_srv_dst', label: 'ct_srv_dst', type: 'number', step: '1', tooltip: 'No. of connections with same service to destination' },
      { key: 'is_sm_ips_ports', label: 'is_sm_ips_ports (0/1)', type: 'number', step: '1', tooltip: '1 if source and destination IP and ports match, else 0' },
    ]
  },
  {
    id: 'application',
    name: 'HTTP / FTP Metrics',
    icon: 'Globe',
    description: 'Application layer protocol metrics for web and file transfer inspection',
    features: [
      { key: 'trans_depth', label: 'HTTP Trans Depth', type: 'number', step: '1', tooltip: 'Pipelined HTTP request depth' },
      { key: 'response_body_len', label: 'HTTP Response Body Len', type: 'number', step: '1', tooltip: 'Actual uncompressed content size transferred' },
      { key: 'is_ftp_login', label: 'is_ftp_login (0/1)', type: 'number', step: '1', tooltip: '1 if FTP session accessed with user/password' },
      { key: 'ct_ftp_cmd', label: 'FTP Cmd Count', type: 'number', step: '1', tooltip: 'No. of FTP commands issued in session' },
      { key: 'ct_flw_http_mthd', label: 'HTTP Method Count', type: 'number', step: '1', tooltip: 'No. of HTTP methods (GET, POST) in flow' },
    ]
  }
];

export const INITIAL_FORM_STATE = {
  dur: 0.0,
  proto: 'tcp',
  service: 'http',
  state: 'FIN',
  spkts: 10.0,
  dpkts: 8.0,
  sbytes: 842.0,
  dbytes: 354.0,
  rate: 8.412,
  sttl: 254.0,
  dttl: 252.0,
  sload: 3000.0,
  dload: 1227.0,
  sloss: 0.0,
  dloss: 0.0,
  sinpkt: 19.3,
  dinpkt: 36.3,
  sjit: 100.0,
  djit: 50.0,
  swin: 255.0,
  stcpb: 190656160.0,
  dtcpb: 3729297770.0,
  dwin: 255.0,
  tcprtt: 0.057,
  synack: 0.008,
  ackdat: 0.049,
  smean: 84.0,
  dmean: 44.0,
  trans_depth: 0.0,
  response_body_len: 0.0,
  ct_srv_src: 1.0,
  ct_state_ttl: 1.0,
  ct_dst_ltm: 1.0,
  ct_src_dport_ltm: 1.0,
  ct_dst_sport_ltm: 1.0,
  ct_dst_src_ltm: 1.0,
  is_ftp_login: 0.0,
  ct_ftp_cmd: 0.0,
  ct_flw_http_mthd: 0.0,
  ct_src_ltm: 1.0,
  ct_srv_dst: 1.0,
  is_sm_ips_ports: 0.0,
};

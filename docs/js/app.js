var fileName;
var ipfsGateway = 'https://ipfs.io/ipfs/';
var ipfsHash = 'QmPcFGJ5YhZCgdV18kJMHLAtMCGdAeLsXEpj8HynFQLssq';

App = {
    web3provider: null,
    contracts: {},
    account: null,

    init: function() {
        console.log('App Initialized...');
        document.getElementById('photo').src = ipfsGateway + ipfsHash;
        App.initWeb3();
    },
    // Initializes Web3
    initWeb3: function() {
        if(window.ethereum) {
            console.log('MetaMask Installed...');
            App.web3provider = window.ethereum;
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
        } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('https://127.0.0.1/7545');
            window.web3 = new Web3(window.ethereum);
        }
        App.initContracts();
    },
    // Initializes Contract
    initContracts: function() {
        $.getJSON('IPFSImageUploader.json', function(ipfsImageUploader) {
            App.contracts.IPFSImageUploader = TruffleContract(ipfsImageUploader);
            App.contracts.IPFSImageUploader.setProvider(App.web3provider);
            App.contracts.IPFSImageUploader.deployed().then(function(instance) {
                console.log('Contract Address: ', instance.address);
                App.setAccount();
                App.listenForEvents();
            });
        });
    },
    // Listen for Events and Take Actions
    listenForEvents: function() {
        App.contracts.IPFSImageUploader.deployed().then(function(instance) {
            // Event 1
            instance.IPFSHash({
                filter: {},
                fromBlock: 0
            }, function(error, event) { 
                console.log("Event : ", event); 
                App.render();
            });
        });
    },
    setAccount: function() {
        web3.eth.getAccounts().then(function(accounts) {
            App.account = accounts[0];
            console.log('Account : ', App.account);
            App.render();
        });
    },
    render: function(){
        if(account !== null) {
            $('#account').html(App.account);
            $('#disconnected').hide();
            $('#connected').show();
        }
        App.getHash();
    },
    setHash: function(hash) {
        App.contracts.IPFSImageUploader.deployed().then(function(instance) {
            return instance.set(hash, { from: App.account });
        }).then(function(receipt) {
            App.getHash();
        });
    },
    getHash: function() {
        App.contracts.IPFSImageUploader.deployed().then(function(instance) {
            return instance.get();
        }).then(function(hash) {
            console.log('IPFS Hash From Contract: ', hash);
            ipfsHash = hash;
            document.getElementById('photo').src = ipfsGateway + ipfsHash;
        });
    }
}



$(document).ready(function() {
    App.init();
});

window.ethereum.on('accountsChanged', (accounts) => {
    App.setAccount();
});

$(".custom-file-input").on("change", function() {
    fileName = $(this).val(); // .split("\\").pop();
    let label = fileName.split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(label);
});
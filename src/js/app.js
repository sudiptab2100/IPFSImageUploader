App = {
    web3provider: null,
    contracts: {},
    account: '0x0',

    init: function() {
        console.log('App Initialized...');
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
        $.getJSON('ContractName.json', function(instance) { // Set Contract Name Properly
            App.contracts.DeElect = TruffleContract(instance);
            App.contracts.DeElect.setProvider(App.web3provider);
            App.contracts.DeElect.deployed().then(function(instance) {
                console.log('Contract Address: ', instance.address);
                App.render();
                App.listenForEvents();
            });
        });
    },
    // Listen for Events and Take Actions
    listenForEvents: function() {
        App.contracts.DeElect.deployed().then(function(instance) {
            // Event 1
            instance.Event1({
                filter: {},
                fromBlock: 0
            }, function(error, event) { 
                console.log("Event1: ", event); 
                App.render(); 
            });

            // Event 2
            instance.Event2({
                filter: {},
                fromBlock: 0
            }, function(error, event) { 
                console.log("Event2: ", event); 
                App.render(); 
            });
        });
    },
    render: function(){
        // UI Changes
    },
}



$(document).ready(function() {
    App.init();
});

window.ethereum.on('accountsChanged', (accounts) => {
    App.render();
});
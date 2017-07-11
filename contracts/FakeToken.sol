pragma solidity ^0.4.11;
import "./zeppelin/token/StandardToken.sol";

// Fake token to use with testing
contract FakeToken is StandardToken {
    // Public variables
    string constant public name = "Fake-Token"; 
    string constant public symbol = "FAKE";
    uint constant public decimals = 18;
    
    // Constants for creating 21 Million tokens of initial supply
    uint constant MILLION = 10 ** 6;
    uint constant BASE_UNITS = 10 ** decimals;    
    uint constant INITIAL_SUPPLY = 21 * MILLION * BASE_UNITS;

    function FakeToken() {
        totalSupply = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
    }
}
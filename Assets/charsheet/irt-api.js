/**
 * I Rikets Tjänst - Roll20 API Script
 * Handles dice rolls with Fokus management
 * 
 * Commands:
 *   !irt roll <dice> [--name "Roll Name"] [--target X] [--char CharID]
 *   !irt damage <dice> [--name "Weapon Name"] [--char CharID]
 *   !irt fokus <rollId> <amount>  - Spend Fokus to add dice to a previous roll
 */

const IRTRoller = (() => {
    'use strict';
    
    const VERSION = '1.0.0';
    const SCRIPT_NAME = 'I Rikets Tjänst';
    
    // Store pending rolls for Fokus spending
    const pendingRolls = {};
    let rollIdCounter = 0;
    
    // CSS styles for chat output
    const styles = {
        container: 'background: #1a237e; border: 2px solid #c62828; border-radius: 5px; padding: 10px; margin: 5px 0; font-family: "Courier New", monospace;',
        header: 'background: #1a237e; color: #ffffff; padding: 8px; text-align: center; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; border-bottom: 3px solid #ffc107;',
        body: 'background: #fafafa; padding: 10px;',
        diceContainer: 'display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; margin: 10px 0;',
        die: 'width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; border-radius: 3px; font-weight: bold; font-size: 14px;',
        dieNormal: 'background: #e0e0e0; color: #212121; border: 1px solid #9e9e9e;',
        dieSuccess: 'background: #2e7d32; color: #ffffff; border: 1px solid #1b5e20;',
        dieFokus: 'background: #ffc107; color: #212121; border: 2px solid #ff8f00;',
        resultRow: 'display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #e0e0e0;',
        label: 'font-weight: bold; color: #757575; text-transform: uppercase; font-size: 11px;',
        value: 'font-weight: bold; color: #212121; font-size: 14px;',
        successCount: 'font-size: 24px; font-weight: bold; color: #2e7d32; text-align: center; padding: 10px;',
        failCount: 'font-size: 24px; font-weight: bold; color: #c62828; text-align: center; padding: 10px;',
        fokusEarned: 'background: #fff8e1; border-left: 3px solid #ffc107; padding: 8px; margin: 8px 0; font-size: 12px;',
        komplikation: 'background: #ffebee; border-left: 3px solid #c62828; padding: 8px; margin: 8px 0; color: #c62828; font-weight: bold;',
        button: 'background: #c62828; color: #ffffff; border: none; padding: 6px 12px; margin: 2px; cursor: pointer; font-family: "Courier New", monospace; font-size: 11px; text-transform: uppercase;',
        buttonRow: 'text-align: center; margin-top: 10px;'
    };
    
    /**
     * Roll d12 dice and count successes (10+) and Fokus (12)
     */
    const rollDice = (numDice) => {
        const results = [];
        for (let i = 0; i < numDice; i++) {
            results.push(randomInteger(12));
        }
        return results;
    };
    
    /**
     * Analyze dice results
     */
    const analyzeResults = (diceResults) => {
        let successes = 0;
        let fokusEarned = 0;
        
        diceResults.forEach(die => {
            if (die >= 10) successes++;
            if (die === 12) fokusEarned++;
        });
        
        return { successes, fokusEarned };
    };
    
    /**
     * Format dice for display
     */
    const formatDice = (diceResults) => {
        return diceResults.map(die => {
            let style = styles.die;
            if (die === 12) {
                style += styles.dieFokus;
            } else if (die >= 10) {
                style += styles.dieSuccess;
            } else {
                style += styles.dieNormal;
            }
            return `<span style="${style}">${die}</span>`;
        }).join('');
    };
    
    /**
     * Get character attribute value
     */
    const getAttr = (charId, attrName, defaultVal = 0) => {
        const attr = findObjs({
            type: 'attribute',
            characterid: charId,
            name: attrName
        })[0];
        return attr ? parseInt(attr.get('current')) || defaultVal : defaultVal;
    };
    
    /**
     * Set character attribute value
     */
    const setAttr = (charId, attrName, value) => {
        let attr = findObjs({
            type: 'attribute',
            characterid: charId,
            name: attrName
        })[0];
        
        if (attr) {
            attr.set('current', value);
        } else {
            createObj('attribute', {
                characterid: charId,
                name: attrName,
                current: value
            });
        }
    };
    
    /**
     * Build the chat output for a roll
     */
    const buildRollOutput = (rollData) => {
        const { rollName, diceResults, successes, fokusEarned, target, fokusSpent, isKomplikation, rollId, charId, canSpendFokus } = rollData;
        
        const isSuccess = successes >= target;
        
        let html = `<div style="${styles.container}">`;
        html += `<div style="${styles.header}">${rollName}</div>`;
        html += `<div style="${styles.body}">`;
        
        // Dice display
        html += `<div style="${styles.diceContainer}">${formatDice(diceResults)}</div>`;
        
        // Results
        html += `<div style="${isSuccess ? styles.successCount : styles.failCount}">`;
        html += `${successes} Framgång${successes !== 1 ? 'ar' : ''}`;
        if (target > 1) {
            html += ` (behöver ${target})`;
        }
        html += `</div>`;
        
        // Fokus earned
        if (fokusEarned > 0) {
            html += `<div style="${styles.fokusEarned}">`;
            html += `✦ +${fokusEarned} Fokus (från 12:or)`;
            html += `</div>`;
        }
        
        // Fokus spent indicator
        if (fokusSpent > 0) {
            html += `<div style="${styles.resultRow}">`;
            html += `<span style="${styles.label}">Fokus spenderat:</span>`;
            html += `<span style="${styles.value}">${fokusSpent}</span>`;
            html += `</div>`;
        }
        
        // Komplikation warning
        if (isKomplikation) {
            html += `<div style="${styles.komplikation}">`;
            html += `⚠ KOMPLIKATION! Fokus spenderat men slaget misslyckades.`;
            html += `</div>`;
        }
        
        // Fokus spending buttons (only if failed and can spend more)
        if (!isSuccess && canSpendFokus && rollId) {
            html += `<div style="${styles.buttonRow}">`;
            html += `<span style="font-size: 11px; color: #757575;">Spendera Fokus:</span><br>`;
            for (let i = 1; i <= 3; i++) {
                html += `[+${i} tärning${i > 1 ? 'ar' : ''}](!irt fokus ${rollId} ${i})`;
            }
            html += `</div>`;
        }
        
        html += `</div></div>`;
        
        return html;
    };
    
    /**
     * Handle the main roll command
     */
    const handleRoll = (msg, args) => {
        const playerId = msg.playerid;
        const charId = args.char || (msg.selected && msg.selected[0] ? 
            getObj('graphic', msg.selected[0]._id)?.get('represents') : null);
        
        if (!charId) {
            sendChat(SCRIPT_NAME, `/w "${msg.who}" Du måste välja en token eller ange --char.`);
            return;
        }
        
        const numDice = parseInt(args._[0]) || 2;
        const rollName = args.name || 'Egenskapsslag';
        const target = parseInt(args.target) || 1;
        
        // Roll the dice
        const diceResults = rollDice(numDice);
        const { successes, fokusEarned } = analyzeResults(diceResults);
        
        // Update Fokus on sheet (add earned)
        const currentFokus = getAttr(charId, 'fokus', 0);
        const newFokus = currentFokus + fokusEarned;
        setAttr(charId, 'fokus', newFokus);
        
        // Store roll for potential Fokus spending
        const rollId = `roll_${Date.now()}_${++rollIdCounter}`;
        const isSuccess = successes >= target;
        
        if (!isSuccess) {
            pendingRolls[rollId] = {
                charId,
                playerId,
                rollName,
                diceResults: [...diceResults],
                successes,
                fokusEarned,
                target,
                fokusSpent: 0,
                timestamp: Date.now()
            };
            
            // Clean up old pending rolls (older than 10 minutes)
            const now = Date.now();
            Object.keys(pendingRolls).forEach(id => {
                if (now - pendingRolls[id].timestamp > 600000) {
                    delete pendingRolls[id];
                }
            });
        }
        
        // Build and send output
        const output = buildRollOutput({
            rollName,
            diceResults,
            successes,
            fokusEarned,
            target,
            fokusSpent: 0,
            isKomplikation: false,
            rollId: isSuccess ? null : rollId,
            charId,
            canSpendFokus: !isSuccess && newFokus > 0
        });
        
        const character = getObj('character', charId);
        const charName = character ? character.get('name') : 'Okänd';
        sendChat(`character|${charId}`, output);
    };
    
    /**
     * Handle Fokus spending on a previous roll
     */
    const handleFokusSpend = (msg, args) => {
        const rollId = args._[0];
        const fokusToSpend = parseInt(args._[1]) || 1;
        
        if (!rollId || !pendingRolls[rollId]) {
            sendChat(SCRIPT_NAME, `/w "${msg.who}" Det slaget finns inte längre tillgängligt.`);
            return;
        }
        
        const rollData = pendingRolls[rollId];
        
        // Check if player owns this roll
        if (rollData.playerId !== msg.playerid && !playerIsGM(msg.playerid)) {
            sendChat(SCRIPT_NAME, `/w "${msg.who}" Du kan inte spendera Fokus på någon annans slag.`);
            return;
        }
        
        // Check if character has enough Fokus
        const currentFokus = getAttr(rollData.charId, 'fokus', 0);
        if (currentFokus < fokusToSpend) {
            sendChat(SCRIPT_NAME, `/w "${msg.who}" Inte tillräckligt med Fokus! (Har: ${currentFokus}, Behöver: ${fokusToSpend})`);
            return;
        }
        
        // Roll additional dice
        const newDice = rollDice(fokusToSpend);
        const newResults = analyzeResults(newDice);
        
        // Update roll data
        rollData.diceResults = rollData.diceResults.concat(newDice);
        rollData.successes += newResults.successes;
        rollData.fokusEarned += newResults.fokusEarned;
        rollData.fokusSpent += fokusToSpend;
        
        // Deduct Fokus spent
        const afterSpendFokus = currentFokus - fokusToSpend + newResults.fokusEarned;
        setAttr(rollData.charId, 'fokus', afterSpendFokus);
        
        // Check for Komplikation
        const isSuccess = rollData.successes >= rollData.target;
        const isKomplikation = !isSuccess && rollData.fokusSpent > 0;
        
        // If still failed and has fokus, keep in pending
        if (!isSuccess && afterSpendFokus > 0) {
            rollData.timestamp = Date.now(); // Refresh timeout
        } else {
            delete pendingRolls[rollId];
        }
        
        // Build and send updated output
        const output = buildRollOutput({
            rollName: rollData.rollName + ' (uppdaterat)',
            diceResults: rollData.diceResults,
            successes: rollData.successes,
            fokusEarned: rollData.fokusEarned,
            target: rollData.target,
            fokusSpent: rollData.fokusSpent,
            isKomplikation,
            rollId: (!isSuccess && afterSpendFokus > 0) ? rollId : null,
            charId: rollData.charId,
            canSpendFokus: !isSuccess && afterSpendFokus > 0
        });
        
        sendChat(`character|${rollData.charId}`, output);
    };
    
    /**
     * Handle damage roll
     */
    const handleDamage = (msg, args) => {
        const numDice = parseInt(args._[0]) || 1;
        const weaponName = args.name || 'Skada';
        
        const diceResults = rollDice(numDice);
        let totalDamage = 0;
        let criticals = 0;
        
        diceResults.forEach(die => {
            totalDamage += die;
            if (die === 12) criticals++;
        });
        
        let html = `<div style="${styles.container}">`;
        html += `<div style="${styles.header}">${weaponName}</div>`;
        html += `<div style="${styles.body}">`;
        html += `<div style="${styles.diceContainer}">${formatDice(diceResults)}</div>`;
        html += `<div style="${styles.successCount}">${totalDamage} KP skada</div>`;
        
        if (criticals > 0) {
            html += `<div style="${styles.fokusEarned}">`;
            html += `💀 ${criticals} Kritisk${criticals > 1 ? 'a' : ''} träff${criticals > 1 ? 'ar' : ''}! Slå på kritiska tabellen.`;
            html += `</div>`;
        }
        
        html += `</div></div>`;
        
        sendChat(msg.who, html);
    };
    
    /**
     * Parse command arguments
     */
    const parseArgs = (content) => {
        const args = { _: [] };
        const parts = content.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
        
        let currentFlag = null;
        parts.forEach(part => {
            if (part.startsWith('--')) {
                currentFlag = part.slice(2);
                args[currentFlag] = true;
            } else if (currentFlag) {
                args[currentFlag] = part.replace(/^"|"$/g, '');
                currentFlag = null;
            } else {
                args._.push(part);
            }
        });
        
        return args;
    };
    
    /**
     * Handle incoming chat messages
     */
    const handleInput = (msg) => {
        if (msg.type !== 'api' || !msg.content.startsWith('!irt')) return;
        
        const content = msg.content.slice(5).trim();
        const args = parseArgs(content);
        const command = args._.shift();
        
        switch (command) {
            case 'roll':
                handleRoll(msg, args);
                break;
            case 'damage':
            case 'skada':
                handleDamage(msg, args);
                break;
            case 'fokus':
                handleFokusSpend(msg, args);
                break;
            default:
                sendChat(SCRIPT_NAME, `/w "${msg.who}" Okänt kommando. Använd: !irt roll, !irt damage, eller !irt fokus`);
        }
    };
    
    /**
     * Register event handlers
     */
    const registerEventHandlers = () => {
        on('chat:message', handleInput);
    };
    
    /**
     * Initialize script
     */
    on('ready', () => {
        registerEventHandlers();
        log(`${SCRIPT_NAME} v${VERSION} loaded.`);
    });
    
    return {
        // Expose for testing/debugging
        rollDice,
        analyzeResults
    };
})();

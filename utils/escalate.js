/**
 * @param {import('eslint').Linter.Config} config
 * @param {'error' | 'warn'} type
 */
const escalate = (config, type) => {
    const copiedConfig = { ...config };

    if(config.rules) {
        copiedConfig.rules = { ...copiedConfig.rules };
        for(const [rule, ruleOptions] of Object.entries(config.rules)) {
            if(typeof ruleOptions === 'string' && ruleOptions === 'escalate') {
                copiedConfig.rules[rule] = type;
            } else if(Array.isArray(ruleOptions) && ruleOptions[0] === 'escalate') {
                copiedConfig.rules[rule][0] = type;
            }
        }
    }

    return copiedConfig;
}

module.exports = escalate;
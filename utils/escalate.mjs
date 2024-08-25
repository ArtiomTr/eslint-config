/**
 * @param {import('eslint').Linter.Config} config
 * @param {'error' | 'warn'} type
 */
const escalate = (config, type) => {
    const copiedConfig = [...config];

    const ruleQueue = [...copiedConfig];

    while (ruleQueue.length > 0) {
        const currentConfig = ruleQueue.shift();

        if (!currentConfig) {
            continue;
        }

        if (currentConfig.rules) {
            currentConfig.rules = { ...currentConfig.rules };
            for (const [rule, ruleOptions] of Object.entries(currentConfig.rules)) {
                if (typeof ruleOptions === 'string' && ruleOptions === 'escalate') {
                    currentConfig.rules[rule] = type;
                } else if (Array.isArray(ruleOptions) && ruleOptions[0] === 'escalate') {
                    currentConfig.rules[rule][0] = type;
                }
            }
        }

        if (currentConfig.overrides && Array.isArray(currentConfig.overrides)) {
            ruleQueue.push(...currentConfig.overrides);
        }
    }

    return copiedConfig;
};

export { escalate };

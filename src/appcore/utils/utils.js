const roleHierarchy = {
    ROLE_ADMIN: ["ROLE_ADMIN", "ROLE_DISPATCH_MANAGE", "ROLE_USER", "ROLE_EMPLOYEE"],
    ROLE_DISPATCH_MANAGE: ["ROLE_DISPATCH_MANAGE", "ROLE_DISPATCH_READ", "ROLE_EMPLOYEE"],
    ROLE_EMPLOYEE: ["ROLE_EMPLOYEE"]
};

/**
 * 사용자가 특정 권한을 가지고 있는지 확인
 * @param {string[]} userRoles - 사용자의 현재 역할 배열
 * @param {string[]} requiredRoles - 필요한 역할 배열
 * @returns {boolean} 권한이 있는지 여부
 */
export const hasAccess = (userRoles, requiredRoles) => {
    if (!userRoles || !requiredRoles) return false;

    // 사용자 역할을 확장된 계층 구조로 변환
    const expandedRoles = userRoles.flatMap((role) => roleHierarchy[role] || []);
    // 필요한 역할 중 하나라도 포함되었는지 확인
    return requiredRoles.some((requiredRole) => expandedRoles.includes(requiredRole));
};

/**
 * 사용자가 특정 권한을 직접 가지고 있는지 확인 (계층 구조 고려 X)
 * @param {string[]} userRoles - 사용자의 현재 역할 배열
 * @param {string} roleToCheck - 확인할 단일 역할
 * @returns {boolean} 해당 역할을 직접 가지고 있는지 여부
 */
export const hasDirectRole = (userRoles, roleToCheck) => {
    if (!userRoles || !roleToCheck) return false;
    return userRoles.includes(roleToCheck);
};

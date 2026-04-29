package com.CAPSTONEPROJECT.CAPSTONE.entity;

/**
 * Role enum defines the two user types in the system.
 * CUSTOMER - can access /customer/** endpoints only.
 * OWNER    - can access /owner/**  endpoints only.
 */
public enum Role {
    CUSTOMER,
    OWNER
}


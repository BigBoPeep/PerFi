import { createContext, useContext, useState, useCallback } from "react";
import type React from "react";

const sharedTransition = "duration-300";

interface TransactionModal
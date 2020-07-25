import { UserId } from "../state";
import StorageManager from "./storage-manager";
interface HistoryManager {
}
export declare type HistoryManagerConstructor = (userId: UserId, storageManager: StorageManager) => HistoryManager;
export default HistoryManager;

"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEllipsisVertical, 
  faPenToSquare, 
  faTrashCan, 
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

type KebabVariant = 'default' | 'edit';

interface Props {
  variant?: KebabVariant;
  onEdit?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
  className?: string;
}

const KebabMenu = ({ 
  variant = 'default', 
  onEdit, 
  onDelete, 
  onReport, 
  className 
}: Props) => {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <button 
          type="button"
          className={`cursor-pointer flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors outline-none ${className}`}
        >
          <FontAwesomeIcon icon={faEllipsisVertical} className="w-5 h-5 text-gray-400" />
        </button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={5}
          className="z-50 min-w-[140px] overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg animate-in fade-in-80 zoom-in-95"
        >
          {variant === 'edit' && onEdit && (
            <DropdownMenuPrimitive.Item
              onSelect={onEdit}
              className="body-lg flex cursor-pointer items-center px-3 py-2.5 text-gray-700 outline-none hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4 mr-3 text-gray-400" />
              수정하기
            </DropdownMenuPrimitive.Item>
          )}

          {onDelete && (
            <DropdownMenuPrimitive.Item
              onSelect={onDelete}
              className="body-lg flex cursor-pointer items-center px-3 py-2.5 text-gray-700 outline-none hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faTrashCan} className="w-4 h-4 mr-3 text-gray-400" />
              삭제하기
            </DropdownMenuPrimitive.Item>
          )}

          {onReport && (
            <DropdownMenuPrimitive.Item
              onSelect={onReport}
              className="body-lg flex cursor-pointer items-center px-3 py-2.5 text-gray-700 outline-none hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faTriangleExclamation} className="w-4 h-4 mr-3 text-gray-400" />
              신고하기
            </DropdownMenuPrimitive.Item>
          )}
          
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};

export default KebabMenu;
